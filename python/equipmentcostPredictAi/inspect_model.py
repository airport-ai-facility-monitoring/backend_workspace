# inspect_model.py
import joblib, json, sys
from pathlib import Path
from typing import Any, Dict, List, Optional

def load_model(path: str):
    return joblib.load(path)

def try_get_booster_feature_names(model) -> Optional[List[str]]:
    """
    LightGBM 계열에서 변환 '후' 피처 이름 얻기
    - LGBMRegressor/LGBMClassifier: model.booster_.feature_name()
    - native Booster: model.feature_name()
    """
    try:
        if hasattr(model, "booster_"):
            return list(model.booster_.feature_name())
        if hasattr(model, "feature_name"):
            return list(model.feature_name())
    except Exception:
        pass
    return None

def try_get_column_transformer(model):
    """
    sklearn Pipeline 내부에서 ColumnTransformer 찾기
    """
    if hasattr(model, "named_steps"):
        from sklearn.compose import ColumnTransformer
        for name, step in model.named_steps.items():
            if isinstance(step, ColumnTransformer):
                return step
    return None

def get_transformed_feature_names_from_ct(ct) -> Optional[List[str]]:
    try:
        # sklearn >= 1.0
        return list(ct.get_feature_names_out())
    except Exception:
        return None

def introspect_ct(ct) -> Dict[str, Any]:
    """
    ColumnTransformer 내부를 파고들어
    - 원본 숫자 컬럼 목록
    - 원본 범주형 컬럼 목록
    - OneHotEncoder 카테고리(열거)
    를 수집한다.
    """
    original_num = []
    original_cat = []
    onehot_detail: Dict[str, Dict[str, List[str]]] = {}

    for trans_name, transformer, columns in ct.transformers_:
        if transformer == "drop":
            continue

        cols = list(columns) if not isinstance(columns, slice) else list(range(columns.start or 0, columns.stop))
        # 파이프라인 안쪽 탐색
        from sklearn.pipeline import Pipeline as SkPipeline
        if isinstance(transformer, SkPipeline):
            from sklearn.preprocessing import OneHotEncoder
            hit_ohe = False
            for inner_name, inner_step in transformer.named_steps.items():
                if isinstance(inner_step, OneHotEncoder):
                    hit_ohe = True
                    original_cat.extend(cols)
                    cats = {}
                    for col, values in zip(cols, inner_step.categories_):
                        cats[str(col)] = [None if v is None else str(v) for v in values]
                    onehot_detail[trans_name] = cats
            if not hit_ohe:
                # 숫자 변환/스케일링 파이프라인일 가능성 높음
                original_num.extend(cols)
        else:
            # 변환기가 바로 OHE 혹은 스케일러 등
            from sklearn.preprocessing import OneHotEncoder
            if hasattr(transformer, "categories_"):  # OneHotEncoder
                original_cat.extend(cols)
                cats = {}
                for col, values in zip(cols, transformer.categories_):
                    cats[str(col)] = [None if v is None else str(v) for v in values]
                onehot_detail[trans_name] = cats
            else:
                original_num.extend(cols)

    # 컬럼명이 문자열이 아닐 수도 있어 dict 키는 문자열로 통일
    original_num = [str(c) for c in original_num]
    original_cat = [str(c) for c in original_cat]

    return {
        "original_numeric_cols": sorted(set(original_num)),
        "original_categorical_cols": sorted(set(original_cat)),
        "onehot_detail": onehot_detail,
    }

def build_meta_from_outputs(
    transformed_feature_names: Optional[List[str]],
    ct_info: Dict[str, Any]
) -> Dict[str, Any]:
    """
    shim용 메타 JSON 자동 생성 시도
    - OHE를 썼다면 transformed_feature_names 에 원핫 이름이 들어있고,
      onehot_detail로부터 (컬럼=범주) 순서(order)를 최대한 복원
    - 숫자 열은 transformed_feature_names 또는 original_numeric_cols로 정리
    """
    numeric_cols = ct_info.get("original_numeric_cols") or []
    # 범주형 원본 및 카테고리
    categorical_detail = {}  # {col: [cats]}
    for block in ct_info.get("onehot_detail", {}).values():
        for col, cats in block.items():
            categorical_detail[col] = cats

    order: List[str] = []
    if transformed_feature_names:
        # sklearn ColumnTransformer OHE naming 규칙 예:
        # 'preprocess__cat__manufacturer_ACME' → 뒤쪽 토큰으로 복원 시도
        # 혹은 'onehot__manufacturer_ACME' 등
        for name in transformed_feature_names:
            # 이름 끝이 "...<col>_<cat>" 형태라면 잡아낸다
            part = name.split("__")[-1]  # 마지막 스텝명 구간
            if "_" in part:
                col, cat = part.rsplit("_", 1)
                # 카테고리 후보에 존재하면 (col=cat) 원핫
                if col in categorical_detail and cat in [str(c) for c in categorical_detail[col]]:
                    order.append(f"{col}={cat}")
                else:
                    # 숫자 열 후보
                    if part in numeric_cols or col in numeric_cols:
                        order.append(col if col in numeric_cols else part)
                    else:
                        # 들어온 모양 그대로 보존(최후의 수단)
                        order.append(name)
            else:
                # 원핫이 아닐 수치 열로 가정
                order.append(part)
    else:
        # 부스터만 있고 변환 이름을 모르면, categorical_detail로부터 원핫 순서를 구성
        for col, cats in categorical_detail.items():
            for cat in cats:
                order.append(f"{col}={cat}")
        # 숫자열 붙이기
        order.extend(numeric_cols)

    # 중복 제거(첫 등장 우선)
    seen = set()
    clean_order = []
    for x in order:
        if x not in seen:
            seen.add(x)
            clean_order.append(x)

    meta = {
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_detail,   # {col: [cat1, cat2, ...]}
        "order": clean_order,
        "unknown_policy": "ignore"
    }
    return meta

def inspect(path: str) -> Dict[str, Any]:
    model = load_model(path)

    # 변환 후 피처 이름
    transformed_feature_names = try_get_booster_feature_names(model)

    # ColumnTransformer 탐지
    ct = try_get_column_transformer(model)
    ct_info = {"original_numeric_cols": [], "original_categorical_cols": [], "onehot_detail": {}}
    if ct is not None:
        ct_names = get_transformed_feature_names_from_ct(ct)
        if ct_names and not transformed_feature_names:
            transformed_feature_names = ct_names
        ct_info = introspect_ct(ct)

    out = {
        "model_path": path,
        "has_pipeline": bool(hasattr(model, "named_steps")),
        "transformed_feature_names": transformed_feature_names,
        "original_numeric_cols": ct_info["original_numeric_cols"],
        "original_categorical_cols": ct_info["original_categorical_cols"],
        "onehot_detail": ct_info["onehot_detail"],
    }

    # shim 메타 자동 생성 시도
    out["shim_meta"] = build_meta_from_outputs(transformed_feature_names, ct_info)
    return out

def main():
    if len(sys.argv) < 2:
        print("Usage: python inspect_model.py models/weather_model.pkl [models/lighting_model.pkl ...]")
        sys.exit(1)

    for p in sys.argv[1:]:
        info = inspect(p)
        print("\n=== Inspect:", p, "===")
        print("has_pipeline:", info["has_pipeline"])
        print("original_numeric_cols:", info["original_numeric_cols"])
        print("original_categorical_cols:", info["original_categorical_cols"])
        print("onehot_detail keys:", list(info["onehot_detail"].keys()))
        print("transformed_feature_names (first 20):", (info["transformed_feature_names"] or [])[:20])
        print("shim_meta.order (first 30):", info["shim_meta"]["order"][:30])

        # 메타 JSON으로 저장(파일명 기준)
        meta_path = Path(p).with_suffix("").name + "_meta.json"
        Path(meta_path).write_text(json.dumps(info["shim_meta"], ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"> meta json saved: {meta_path}")

if __name__ == "__main__":
    main()

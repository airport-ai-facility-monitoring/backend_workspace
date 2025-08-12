# app.py
from typing import Literal, Union, Optional, Dict, Any, List
from enum import Enum
import os, time

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator

app = FastAPI(title="Equipment Maintenance Cost Prediction (API-only)")

# --- 0) 카테고리 (문자 Enum) + 숫자 허용 validator ---
class Category(str, Enum):
    WEATHER = "weather"    # 1
    LIGHTING = "lighting"  # 2
    SIGNAGE = "signage"    # 3

# --- 1) 공통 필드 ---
class CommonFields(BaseModel):
    category: Category
    manufacturer: Optional[str] = None
    purchase: Optional[float] = Field(None, description="구매가 (KRW)")
    failure: Optional[int] = None
    protectionRating: Optional[str] = None
    runtime: Optional[float] = Field(None, description="누적 가동시간(시간)")
    serviceYears: Optional[float] = None
    maintenanceCost: Optional[float] = None
    repairCost: Optional[float] = None
    repairTime: Optional[float] = None
    laborRate: Optional[float] = None
    avgLife: Optional[float] = None

    # 숫자 1/2/3도 허용 → weather/lighting/signage로 매핑
    @field_validator("category", mode="before")
    def coerce_category(cls, v):
        mapping = {
            1: Category.WEATHER, "1": Category.WEATHER,
            2: Category.LIGHTING, "2": Category.LIGHTING,
            3: Category.SIGNAGE, "3": Category.SIGNAGE,
            "weather": Category.WEATHER, "lighting": Category.LIGHTING, "signage": Category.SIGNAGE,
        }
        return mapping.get(v, v)

# --- 2) 카테고리별 추가 필드 ---
class WeatherExtra(BaseModel):
    powerConsumption: Optional[float] = None
    mountType: Optional[str] = None

class LightingExtra(BaseModel):
    lampType: Optional[str] = None
    powerConsumption: Optional[float] = None

class SignageExtra(BaseModel):
    panelWidth: Optional[float] = None
    panelHeight: Optional[float] = None
    material: Optional[str] = None
    signColor: Optional[str] = None
    # UI에선 mountType로 올 수도 있음 → 모델은 installationType 사용
    mountType: Optional[str] = None
    installationType: Optional[str] = None

# --- 3) 분기형 요청 스키마 (Discriminated Union) ---
class WeatherRequest(CommonFields, WeatherExtra):
    category: Literal[Category.WEATHER]

class LightingRequest(CommonFields, LightingExtra):
    category: Literal[Category.LIGHTING]

class SignageRequest(CommonFields, SignageExtra):
    category: Literal[Category.SIGNAGE]

PredictRequest = Union[WeatherRequest, LightingRequest, SignageRequest]

# --- 4) 모델 로딩 ---
MODEL_PATHS = {
    Category.WEATHER:  "models/weather_model.pkl",
    Category.LIGHTING: "models/light_model.pkl",
    Category.SIGNAGE:  "models/sign_model.pkl",
}
MODELS: Dict[Category, Any] = {cat: None for cat in MODEL_PATHS}

for cat, path in MODEL_PATHS.items():
    try:
        MODELS[cat] = joblib.load(path)
        print(f"[OK] Loaded model: {cat.value} <- {path}")
    except Exception as e:
        print(f"[WARN] Model load failed for {cat.value}: {e}")

# --- 5) 학습 시 실제 피처 순서 (inspect 결과 반영) ---
FEATURE_COLUMNS: Dict[Category, List[str]] = {
    # weather_model.pkl
    Category.WEATHER: [
        "category","manufacturer","protectionRating","mountType",
        "purchase","failure","runtime","serviceYears",
        "repairCost","repairTime","laborRate","powerConsumption","avgLife"
    ],
    # light_model.pkl
    Category.LIGHTING: [
        "category","manufacturer","lampType","protectionRating",
        "purchase","failure","runtime","serviceYears",
        "repairCost","repairTime","laborRate","powerConsumption","avgLife"
    ],
    # sign_model.pkl  (※ installationType)
    Category.SIGNAGE: [
        "category","manufacturer","protectionRating","material","installationType",
        "purchase","failure","runtime","serviceYears",
        "repairCost","repairTime","laborRate","avgLife",
        "panelWidth","panelHeight","signColor"
    ],
}

# --- 5-1) 이 모델은 "숫자 인코딩"으로 학습됨 → 숫자 코드로 강제 ---
CODE_COLS: Dict[Category, List[str]] = {
    Category.WEATHER:  ["category","manufacturer","protectionRating","mountType"],
    Category.LIGHTING: ["category","manufacturer","lampType","protectionRating"],
    Category.SIGNAGE:  ["category","manufacturer","protectionRating","material","installationType","signColor"],
}
CATEGORY_NUM = {
    Category.WEATHER: 1,
    Category.LIGHTING: 2,
    Category.SIGNAGE: 3,
}

def build_dataframe(payload: Dict[str, Any], columns: List[str]) -> pd.DataFrame:
    """요청 JSON을 모델 입력 DataFrame으로 매핑(누락→NaN, 여분→무시)"""
    row = {col: payload.get(col, None) for col in columns}
    df = pd.DataFrame([row], columns=columns)
    # None -> NaN (LightGBM/Sklearn 안전)
    df = df.replace({None: np.nan})
    return df

# --- 6) 예측 응답 스키마 ---
class PredictResponse(BaseModel):
    category: Category
    predictedMaintenanceCost: float
    currency: str = "KRW"
    modelVersion: str
    servedAt: int
    featuresUsed: Dict[str, Any]

# --- 7) healthz ---
@app.get("/healthz")
def health():
    ok = {cat.value: (MODELS[cat] is not None) for cat in MODEL_PATHS}
    return {"models": ok}

# --- 8) predict ---
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    cat = req.category
    model = MODELS.get(cat)
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model for '{cat.value}' not available")

    payload = req.dict()

    # signage: mountType -> installationType 보정
    if cat == Category.SIGNAGE:
        if payload.get("installationType") is None and payload.get("mountType") is not None:
            payload["installationType"] = payload["mountType"]

    # 모델이 숫자 코드를 기대 → category를 1/2/3으로 치환
    payload["category"] = CATEGORY_NUM[cat]

    # 숫자 코드로 학습된 컬럼들은 모두 "숫자"여야 함
    need_codes = CODE_COLS[cat]
    for col in need_codes:
        val = payload.get(col, None)
        if val is None:
            continue
        if isinstance(val, (int, float)):
            continue
        if isinstance(val, str) and val.strip().isdigit():
            payload[col] = int(val.strip())
            continue
        raise HTTPException(
            status_code=400,
            detail=f"Column '{col}' must be a numeric code for prediction (got '{val}'). "
                   f"Send numeric codes or add a label-mapping shim."
        )

    cols = FEATURE_COLUMNS[cat]
    X = build_dataframe(payload, cols)

    # ✅ 핵심: 열 순서 고정 + 전부 숫자로 캐스팅 + numpy로 예측
    try:
        # 가능한 건 전부 수치로 강제 (문자면 그대로 두고, 숫자형 문자는 숫자로 변환)
        X_num = X[cols].apply(pd.to_numeric, errors="coerce")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Type casting failed: {e}")

    try:
        # numpy 배열로 넘겨 LightGBM의 카테고리 해석을 차단
        y = model.predict(X_num.to_numpy())[0]
    except Exception as e:
        # 일부 모델이 DataFrame을 선호하는 경우를 대비한 2차 시도
        try:
            y = model.predict(X_num)[0]
        except Exception as e2:
            raise HTTPException(status_code=500, detail=f"Prediction failed: {e2}")

    return PredictResponse(
        category=cat,
        predictedMaintenanceCost=float(y),
        currency="KRW",
        modelVersion=os.getenv("MODEL_VERSION", "2025-08-01"),
        servedAt=int(time.time()),
        featuresUsed={k: payload.get(k, None) for k in cols},
    )

# --- 9) 모델이 보는 피처명 확인 ---
@app.get("/features/{cat}")
def get_model_features(cat: str):
    try:
        category = Category(cat)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Unknown category '{cat}'")

    model = MODELS.get(category)
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model for '{category.value}' not loaded")

    feature_names = None
    categorical_features = None

    try:
        # LightGBM native model
        if hasattr(model, "feature_name"):
            feature_names = list(model.feature_name())
            categorical_features = getattr(model, "categorical_feature", None)
        # LGBMRegressor/Classifier
        elif hasattr(model, "booster_"):
            booster = model.booster_
            feature_names = list(booster.feature_name())
            categorical_features = booster.params.get("categorical_feature", None)
        # Pipeline 내부 모델
        elif hasattr(model, "named_steps"):
            for _, step in model.named_steps.items():
                if hasattr(step, "booster_"):
                    booster = step.booster_
                    feature_names = list(booster.feature_name())
                    categorical_features = booster.params.get("categorical_feature", None)
                    break
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract features: {e}")

    if feature_names is None:
        raise HTTPException(status_code=500, detail="Feature names not found in model")

    return {
        "category": category.value,
        "feature_count": len(feature_names),
        "feature_names": feature_names,
        "categorical_features": categorical_features
    }

# --- 10) 상세 덤프(피처 타입 베스트-에포트) ---
@app.get("/features/detail/{cat}")
def features_detail(cat: str):
    try:
        category = Category(cat)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Unknown category '{cat}'")

    model = MODELS.get(category)
    if model is None:
        raise HTTPException(status_code=503, detail=f"Model for '{category.value}' not loaded")

    # booster 찾기
    booster = None
    if hasattr(model, "booster_"):
        booster = model.booster_
    elif hasattr(model, "dump_model"):
        booster = model
    elif hasattr(model, "named_steps"):
        for _, step in model.named_steps.items():
            if hasattr(step, "booster_"):
                booster = step.booster_
                break
    if booster is None or not hasattr(booster, "dump_model"):
        raise HTTPException(status_code=500, detail="Booster with dump_model() not found")

    info = booster.dump_model()

    feats = []
    finfos = info.get("feature_infos", [])
    # Case A: 최신 포맷(dict)
    if isinstance(finfos, list) and finfos and isinstance(finfos[0], dict):
        for f in finfos:
            feats.append({
                "name": f.get("name"),
                "type": f.get("type"),
                "category_size": f.get("category_size"),
                "category_names": f.get("category_names") or f.get("categories"),
            })
        feature_names = [f.get("name") for f in finfos]
    else:
        # Case B: 포맷이 다를 때 → 파라미터/이름 기반 best-effort
        try:
            feature_names = info.get("feature_names") or list(booster.feature_name())
        except Exception:
            feature_names = list(FEATURE_COLUMNS[category])

        cat_param = None
        try:
            cat_param = booster.params.get("categorical_feature")
        except Exception:
            pass

        cat_names = set()
        if isinstance(cat_param, str):
            parts = [p.strip() for p in cat_param.split(",") if p.strip()]
            if parts and all(p.isdigit() for p in parts):
                idxs = {int(p) for p in parts}
                cat_names = {feature_names[i] for i in idxs if 0 <= i < len(feature_names)}
            else:
                cat_names = set(parts)
        elif isinstance(cat_param, (list, tuple)):
            cat_names = set(map(str, cat_param))

        for n in feature_names:
            feats.append({
                "name": n,
                "type": "categorical" if n in cat_names else "unknown",
                "category_size": None,
                "category_names": None,
            })

    return {
        "category": category.value,
        "feature_count": len(feature_names),
        "features": feats
    }

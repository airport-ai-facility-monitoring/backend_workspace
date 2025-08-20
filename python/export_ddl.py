# python/export_ddl.py
# 필요: pip install sqlalchemy

from sqlalchemy.dialects import mssql  # 방언은 상황에 맞게 (mssql / postgresql / mysql 등)
from importlib import import_module

# 여기에 너의 모델 모듈을 나열 (예: fastapi 서비스 4개)
MODEL_MODULES = [
    "equipmentcostPredictAi.models",   # 예시: python/app_a/models.py 안에 Base 선언
    "app_b.models",
    "app_c.models",
    "app_d.models",
]

out_path = "build/erd/python.sql"

def collect_metadata():
    bases = []
    for mod in MODEL_MODULES:
        m = import_module(mod)
        # Base 또는 declarative_base() 이름이 다르면 맞춰서 수정
        bases.append(getattr(m, "Base"))
    return bases

def main():
    bases = collect_metadata()
    ddl_chunks = []
    for base in bases:
        for tbl in base.metadata.sorted_tables:
            ddl = str(tbl.to_metadata(base.metadata)
                      .to_metadata(base.metadata))  # no-op; ensure Table object
            ddl = str(tbl.compile(dialect=mssql.dialect()))
            ddl_chunks.append(ddl + ";\n")
            for idx in tbl.indexes:
                ddl_chunks.append(str(idx.compile(dialect=mssql.dialect())) + ";\n")

    from pathlib import Path
    Path("build/erd").mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text("".join(ddl_chunks), encoding="utf-8")

if __name__ == "__main__":
    main()

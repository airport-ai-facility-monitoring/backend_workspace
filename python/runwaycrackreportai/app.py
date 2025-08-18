# # app.py
# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib, numpy as np

# app = FastAPI()
# cost_model = joblib.load("models/lr_cost.pkl")
# duration_model = joblib.load("models/lr_days.pkl")
# MCV, MDV = "cost-v1.0", "duration-v1.0"

# try:
#     if hasattr(cost_model, "feature_names_in_"):
#         print("✅ 모델이 학습한 feature 순서:", list(cost_model.feature_names_in_))
#     else:
#         print("✅ feature_names_in_ 속성이 없어, 학습 코드에서 직접 확인 필요")
#     print("✅ 모델이 기대하는 feature 개수:", cost_model.n_features_in_)
# except AttributeError:
#     print("⚠️ 모델에 feature_names_in_ 속성이 없습니다. scikit-learn 1.0 이상에서만 지원됩니다.")

# class PredictIn(BaseModel):
#     crack_length_cm: float
#     crack_area_cm2: float
#     pavement_type_concrete: int
#     epoxy_used: int
#     wiremesh_used: int
#     joint_seal_used: int
#     rebar_used: int
#     polymer_used: int
#     sealing_used: int

# class PredictOut(BaseModel):
#     predictedCost: int
#     predictedDuration: int
#     modelCostVersion: str
#     modelDurationVersion: str

# @app.post("/predict", response_model=PredictOut)
# def predict(p: PredictIn):
#     X = np.array([[p.crack_length_cm,p.crack_area_cm2,p.pavement_type_concrete,
#                    p.epoxy_used,p.wiremesh_used,p.joint_seal_used,
#                    p.rebar_used,p.polymer_used,p.sealing_used]], dtype=float)
#     cost = float(cost_model.predict(X)[0])
#     days = float(duration_model.predict(X)[0])
#     return PredictOut(predictedCost=int(round(cost)),
#                       predictedDuration=int(round(days)),
#                       modelCostVersion=MCV, modelDurationVersion=MDV)
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# 학습된 모델 로드
cost_model = joblib.load("models/lr_cost.pkl")
duration_model = joblib.load("models/lr_days.pkl")

# Pydantic 모델 정의
class CrackFeatures(BaseModel):
    length_cm: float
    avg_width_cm: float
    area_m2: float
    repair_area_m2: float
    pavement_type_concrete: int
    epoxy_used: int
    wiremesh_used: int
    joint_seal_used: int
    rebar_used: int
    polymer_used: int
    sealing_used: int

@app.post("/predict")
def predict(features: CrackFeatures):
    print(features.dict())
    # 학습 시 feature 순서
    feature_order = [
        "length_cm", "avg_width_cm", "area_m2", "repair_area_m2",
        "pavement_type_concrete", "epoxy_used", "wiremesh_used",
        "joint_seal_used", "rebar_used", "polymer_used", "sealing_used"
    ]

    X = np.array([[getattr(features, f) for f in feature_order]])

    # 두 모델 각각 예측
    predicted_cost = float(cost_model.predict(X)[0])
    predicted_duration = float(duration_model.predict(X)[0])

    return {
        "cost": predicted_cost,
        "duration": predicted_duration
    }
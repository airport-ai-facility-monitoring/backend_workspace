package airport.domain;

// 일단은 하드코딩 mock으로 구현하고,
// 나중에 진짜 모델 연동 시 REST API 호출 등으로 확장
public class PredictionService {

    public static int predictCost(String equipmentType) {
        if ("레이더".equals(equipmentType)) {
            return 1500000;
        } else if ("센서".equals(equipmentType)) {
            return 800000;
        } else {
            return 500000;
        }
    }
}
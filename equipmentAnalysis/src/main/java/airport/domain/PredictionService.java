package airport.domain;

// 일단은 하드코딩 mock으로 구현하고,
// 나중에 진짜 모델 연동 시 REST API 호출 등으로 확장
public class PredictionService {

    public static int predictCost(String equipmentType) {
        return switch (equipmentType) {
            case "RampLoader" -> 500_000;
            case "PushbackTruck" -> 700_000;
            case "BeltLoader" -> 400_000;
            default -> 600_000;
        };
    }
}
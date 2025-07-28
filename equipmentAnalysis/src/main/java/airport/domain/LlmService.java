package airport.domain;

// 일단은 하드코딩 mock으로 구현하고,
// 나중에 진짜 모델 연동 시 REST API 호출 등으로 확장
public class LlmService {

    public static String generateReport(String equipmentId, int predictedCost) {
        return """
                장비 점검 보고서
                ----------------------------
                장비 ID: %s
                예측된 유지보수 비용: %,d원
                조치가 필요한 항목은 자동 분석 결과에 기반하여 작성되었습니다.
                """.formatted(equipmentId, predictedCost);
    }
}
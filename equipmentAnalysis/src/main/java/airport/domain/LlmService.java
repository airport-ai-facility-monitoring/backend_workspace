package airport.domain;

// 일단은 하드코딩 mock으로 구현하고,
// 나중에 진짜 모델 연동 시 REST API 호출 등으로 확장
public class LlmService {

    public static String generateReport(Long equipmentId, int predictedCost) {
        StringBuilder sb = new StringBuilder();
        sb.append("장비 점검 보고서\n");
        sb.append("----------------------------\n");
        sb.append("장비 ID: ").append(equipmentId).append("\n");
        sb.append("예측된 유지보수 비용: ").append(String.format("%,d원", predictedCost)).append("\n");
        sb.append("조치가 필요한 항목은 자동 분석 결과에 기반하여 작성되었습니다.\n");
        return sb.toString();
    }
}
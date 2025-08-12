package airport.domain.report;

import lombok.Data;
import java.time.Instant;
import java.util.Map;

@Data
public class ReportPreviewResponse {
    private String llmReport;                 // LLM이 생성한 본문(수정 전 원문)
    private Double maintenanceCost;           // 프롬프트에 쓴 예측 유지보수 비용(확인용)
    private String categoryLabel;             // "조명"/"기상관측"/"표지"
    private Instant generatedAt = Instant.now();
    private Map<String, Object> echo;         // (옵션) 프롬프트에 쓴 입력값 에코백
}
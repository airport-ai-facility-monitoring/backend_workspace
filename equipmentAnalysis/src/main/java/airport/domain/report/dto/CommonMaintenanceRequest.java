package airport.domain.report.dto;
import lombok.Data;

/**
 * 공통 유지보수 요청 DTO
 */
@Data
public class CommonMaintenanceRequest {
    private String category;          // 장비 분류
    private String manufacturer;      // 제조사
    private int purchase;              // 구매 금액 (원)
    private String purchase_date;     // 구매일 (YYYY-MM-DD)
    private int failure;              // 고장 기록 (횟수)
    private String protection_rating; // 보호 등급 (IP등급)
    private int runtime;              // 월 평균 가동 시간 (시간)
    private int service_years;        // 내용 연수 (년)
    private int maintenance_cost;     // 예측 유지보수 비용 (원)
    private int repair_cost;          // 수리 비용 (원)
    private int repair_time;          // 수리 시간 (시간)
    private int labor_rate;           // 시간당 인건비 (원)
    private int avg_life;             // 평균 수명 (년)

    private String llm_report; // 사용자가 편집한 보고서 본문 
}
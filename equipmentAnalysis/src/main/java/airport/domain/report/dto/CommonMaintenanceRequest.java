// airport/domain/report/dto/CommonMaintenanceRequest.java
package airport.domain.report.dto;

import lombok.Data;

/** 공통 유지보수 요청 DTO */
@Data
public class CommonMaintenanceRequest {
    private String category;           // 장비 대분류 (예: lighting/weather/sign 또는 '조명' 등)
    private String sub_category;       // ✅ 장비 소분류 (예: REL)
    private Long   equipment_id;       // ✅ 연계 장비 ID (선택)

    private String name;               // 장비명
    private String manufacturer;       // 제조사
    private Integer purchase;          // 구매 금액 (원)  ← Integer로 NULL 허용
    private String purchase_date;      // 구매일 (YYYY-MM-DD)

    private Integer failure;           // 고장 기록 (횟수)
    private String  protection_rating; // 보호 등급 (IP등급)
    private Integer runtime;           // 월 평균 가동 시간 (시간)
    private Integer service_years;     // 내용 연수 (년)
    private Integer maintenance_cost;  // 예측 유지보수 비용 (원)
    private Integer repair_cost;       // 수리 비용 (원)
    private Integer repair_time;       // 수리 시간 (시간)
    private Integer labor_rate;        // 시간당 인건비 (원)
    private Integer avg_life;          // 평균 수명 (년)

    private String llm_report;         // 사용자가 편집한 보고서 본문
}

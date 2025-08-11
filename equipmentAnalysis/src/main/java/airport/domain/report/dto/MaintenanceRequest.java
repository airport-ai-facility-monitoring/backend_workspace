package airport.domain.report.dto;

import lombok.Data;

/**
 * 클라이언트가 유지보수 분석을 요청할 때 사용하는 DTO(Data Transfer Object) 클래스입니다.
 * HTTP 요청의 JSON 본문(Body)에 담긴 데이터를 자바 객체로 매핑하는 역할을 합니다.
 * 각 필드는 분석에 필요한 장비의 상세 정보를 나타냅니다.
 */
@Data
public class MaintenanceRequest {

    // --- 공통 필드 ---
    private String category;          // 장비 분류 (예: 조명, 표지판)
    private String manufacturer;      // 제조사
    private int purchase;             // 구매 금액 (원)
    private String purchase_date;     // 구매일 (예: "2023-01-15")
    private int failure;              // 고장 기록 (횟수)
    private String protection_rating; // 보호 등급 (예: IP65)
    private int runtime;              // 월 평균 가동 시간 (시간)
    private int service_years;        // 내용 연수 (년)
    private int maintenance_cost;     // 예측 유지보수 비용 (원)
    private int repair_cost;          // 수리 비용 (원)
    private int repair_time;          // 수리 시간 (시간)
    private int labor_rate;           // 시간당 인건비 (원)
    private int avg_life;             // 평균 수명 (년)

    // --- 조명 장비 전용 필드 ---
    private String lamp_type;         // 램프 유형 (예: LED, 할로겐)
    private Integer power_consumption; // 소비 전력 (W)

    // --- 기상관측 장비 전용 필드 ---
    private String mount_type;        // 설치 형태 (예: 지상, 벽면)
    private Integer power_consumption; // 소비 전력 (W)

    // --- 표지판 장비 전용 필드 ---
    private Integer panel_width;      // 패널 너비 (mm)
    private Integer panel_height;     // 패널 높이 (mm)
    private String material;          // 재질 (예: 알루미늄, 플라스틱)
    private String sign_color;        // 색상
    private String mount_type;        // 설치 형태 (예: 지상, 벽면)
}

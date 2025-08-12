package airport.domain.report.dto;

import lombok.Data;

/**
 * 조명 장비 유지보수 요청 DTO
 */
@Data
public class LightingDto extends CommonMaintenanceRequest {
    private String lamp_type;          // 램프 유형 (LED, 할로겐 등)
    private Integer power_consumption; // 소비 전력 (W)
}

package airport.domain.report.dto;

import lombok.Data;


/**
 * 기상관측 장비 유지보수 요청 DTO
 */
@Data
public class WeatherDto extends CommonMaintenanceRequest {
    private Integer power_consumption; // 소비 전력 (W)
    private String mount_type;         // 설치 형태 (지상, 벽면 등)
}
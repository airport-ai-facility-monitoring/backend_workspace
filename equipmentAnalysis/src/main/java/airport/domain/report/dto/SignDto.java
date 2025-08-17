package airport.domain.report.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 표지 장비 유지보수 요청 DTO
 */
@Data
public class SignDto extends CommonMaintenanceRequest {
    private Integer panel_width;       // 패널 너비 (mm)
    private Integer panel_height;      // 패널 높이 (mm)
    private String material;           // 재질 (알루미늄, 플라스틱 등)
    private String sign_color;         // 표지판 색상
    private String mount_type;         // 설치 형태 (지상, 벽면 등)
}
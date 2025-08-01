package airport.dto;

import lombok.Data;

@Data
public class SignEquipmentDetailDto {

    private Long id;
    private String material;
    private String mountType;
    private String signColor;
    private Integer panelWidth;
    private Integer panelHeight;
}

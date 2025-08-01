package airport.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class EquipmentDto {

    private Long equipmentId;
    private String equipmentType;
    private String equipmentName;
    private String state;
    private String category;
    private String manufacturer;
    private String protectionRating;
    private Integer purchase;
    private LocalDateTime purchaseDate;
    private Integer failure;
    private Integer runtime;
    private Integer serviceYears;
    private Integer repairCost;
    private Integer repairTime;
    private Integer laborRate;
    private Integer avgLife;
    private Integer maintenanceCost;
}

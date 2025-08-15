package airport.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import lombok.Data;
import java.time.LocalDateTime;
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

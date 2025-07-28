package airport.domain;

import lombok.Data;

@Data
public class EquipmentIAnalyRequested {

    private Long equipmentId;
    private String equipmentType;
    private String equipmentName;
    private String state;

    public boolean validate() {
        return equipmentId != null && equipmentType != null;
    }

    public String toJson() {
        return "[equipmentId=" + equipmentId + ", equipmentType=" + equipmentType + "]";
    }
}
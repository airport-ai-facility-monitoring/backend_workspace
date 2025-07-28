package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class EquipmentIAnalyRequested extends AbstractEvent {

    private Long equipmentId;
    private String equipmentType;
    private String equipmentName;
    private String state;

    public EquipmentIAnalyRequested(Equipment aggregate) {
        super(aggregate);
    }

    public EquipmentIAnalyRequested() {
        super();
    }
}
//>>> DDD / Domain Event

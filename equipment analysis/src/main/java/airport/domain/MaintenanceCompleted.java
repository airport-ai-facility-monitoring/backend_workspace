package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class MaintenanceCompleted extends AbstractEvent {

    private Long equipReportid;
    private String title;
    private String maintenanceCost;
    private String reportContents;
    private Long equipmentId;

    public MaintenanceCompleted(EquipmentReport aggregate) {
        super(aggregate);
    }

    public MaintenanceCompleted() {
        super();
    }
}
//>>> DDD / Domain Event

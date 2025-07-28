package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.util.*;
import lombok.*;

@Data
@ToString
public class MaintenanceCompleted extends AbstractEvent {

    private Long equipReportid;
    private String title;
    private String maintenanceCost;
    private String reportContents;
    private Long equipmentId;
}

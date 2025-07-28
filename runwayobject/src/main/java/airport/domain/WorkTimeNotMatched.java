package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class WorkTimeNotMatched extends AbstractEvent {

    private Long workTruckId;
    private Integer workTruckType;
    private Date workStartTime;
    private Date workEndTime;
    private Long cctvId;

    public WorkTimeNotMatched(WorkTruck aggregate) {
        super(aggregate);
    }

    public WorkTimeNotMatched() {
        super();
    }
}
// >>> DDD / Domain Event

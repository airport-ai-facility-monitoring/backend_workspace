package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.util.*;
import lombok.*;

@Data
@ToString
public class WorkTimeNotMatched extends AbstractEvent {

    private Long workTruckId;
    private Integer workTruckType;
    private Date workStartTime;
    private Date workEndTime;
    private Long cctvId;
    private Long cctvId;
}

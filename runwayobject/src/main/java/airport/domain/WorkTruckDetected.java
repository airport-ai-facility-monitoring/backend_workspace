package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class WorkTruckDetected extends AbstractEvent {

    private Long objId;
    private Integer objectType;
    private String imageUrl;
    private Long cctvId;

    public WorkTruckDetected(StrangeObject aggregate) {
        super(aggregate);
    }

    public WorkTruckDetected() {
        super();
    }
}
//>>> DDD / Domain Event

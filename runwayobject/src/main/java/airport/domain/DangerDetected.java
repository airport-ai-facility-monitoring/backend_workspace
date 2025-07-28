package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class DangerDetected extends AbstractEvent {

    private Long objId;
    private Integer objectType;
    private String imageUrl;
    private Long cctvId;

    public DangerDetected(StrangeObject aggregate) {
        super(aggregate);
    }

    public DangerDetected() {
        super();
    }
}
//>>> DDD / Domain Event

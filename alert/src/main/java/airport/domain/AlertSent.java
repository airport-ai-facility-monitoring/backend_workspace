package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class AlertSent extends AbstractEvent {

    private Long alertId;
    private String alertLog;
    private Date alertDate;

    public AlertSent(Alert aggregate) {
        super(aggregate);
    }

    public AlertSent() {
        super();
    }
}
//>>> DDD / Domain Event

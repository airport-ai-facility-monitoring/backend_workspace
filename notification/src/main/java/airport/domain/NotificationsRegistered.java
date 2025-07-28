package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class NotificationsRegistered extends AbstractEvent {

    private Long notificationsId;
    private String title;
    private Long writerId;
    private String contents;
    private Date writeDate;

    public NotificationsRegistered(Notification aggregate) {
        super(aggregate);
    }

    public NotificationsRegistered() {
        super();
    }
}
//>>> DDD / Domain Event

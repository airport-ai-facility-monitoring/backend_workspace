package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
//<<< DDD / Domain Event

@Data
@ToString
public class NotificationsRegistered extends AbstractEvent {

    private Long notificationsId;
    private String title;
    private Long writerId;
    private String contents;
    private ZonedDateTime writeDate;
    private boolean important;

    public NotificationsRegistered(Notification aggregate) {
        super(aggregate);
        this.notificationsId = aggregate.getNotificationsId();
        this.title = aggregate.getTitle();
        this.writerId = aggregate.getWriterId();
        this.contents = aggregate.getContents();
        this.writeDate = aggregate.getWriteDate();
        this.important = aggregate.isImportant();
    }

    public NotificationsRegistered() {
        super();
    }
}
//>>> DDD / Domain Event

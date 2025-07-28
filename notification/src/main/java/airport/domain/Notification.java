package airport.domain;

import airport.NotificationApplication;
import airport.domain.NotificationsRegistered;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Notification_table")
@Data
//<<< DDD / Aggregate Root
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long notificationsId;

    private String title;

    private Long writerId;

    private String contents;

    private Date writeDate;

    @PostPersist
    public void onPostPersist() {
        NotificationsRegistered notificationsRegistered = new NotificationsRegistered(
            this
        );
        notificationsRegistered.publishAfterCommit();
    }

    public static NotificationRepository repository() {
        NotificationRepository notificationRepository = NotificationApplication.applicationContext.getBean(
            NotificationRepository.class
        );
        return notificationRepository;
    }

    public static Notification register(RegisterNotificationCommand command) {
        Notification notification = new Notification();
        notification.setTitle(command.getTitle());
        notification.setWriterId(command.getWriterId());
        notification.setContents(command.getContents());
        notification.setWriteDate(new Date());

        return repository().save(notification); // 저장 후 @PostPersist에서 이벤트 자동 발생
    }
}
//>>> DDD / Aggregate Root

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

// 시간
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Entity
@Table(name = "Notification_table", schema = "notification")
@Data
//<<< DDD / Aggregate Root
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long notificationsId;

    private String title;

    private Long writerId;

    private String contents;

    private String fileUrl;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime writeDate;

    @Column(nullable = false)
    private boolean important;

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

    public static Notification register(NotificationsRegistered command, String fileUrl) {
        Notification notification = new Notification();
        notification.setTitle(command.getTitle());
        notification.setWriterId(command.getWriterId());
        notification.setContents(command.getContents());
        notification.setFileUrl(fileUrl);
        notification.setImportant(command.isImportant());
        notification.setWriteDate(LocalDateTime.now());

        return repository().save(notification); // 저장 후 @PostPersist에서 이벤트 자동 발생
    }
}
//>>> DDD / Aggregate Root

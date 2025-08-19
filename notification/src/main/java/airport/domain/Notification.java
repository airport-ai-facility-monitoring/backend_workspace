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
import java.time.ZoneId;
import java.time.ZonedDateTime;

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
    @Column(updatable = false)
    private Long writerId;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String contents;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String fileUrl;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String originalFilename;

    @Column(updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private ZonedDateTime writeDate;

    @Column(nullable = false)
    private boolean important;

    // @PostPersist
    // public void onPostPersist() {

    // }

    public static NotificationRepository repository() {
        NotificationRepository notificationRepository = NotificationApplication.applicationContext.getBean(
            NotificationRepository.class
        );
        return notificationRepository;
    }

    public static Notification register(NotificationsRegistered command, String fileUrl, String originalFilename) {
        Notification notification = new Notification();
        notification.setTitle(command.getTitle());
        notification.setWriterId(command.getWriterId());
        notification.setContents(command.getContents());
        notification.setFileUrl(fileUrl);
        notification.setOriginalFilename(originalFilename);
        notification.setImportant(command.isImportant());
        LocalDateTime now = LocalDateTime.now();
        ZonedDateTime koreanTime = now.atZone(ZoneId.systemDefault()).withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        notification.setWriteDate(koreanTime);

        return repository().save(notification); // 저장 후 @PostPersist에서 이벤트 자동 발생
    }

    public void update(String title, String contents, boolean important, String fileUrl, String originalFilename) {
        this.title = title;
        this.contents = contents;
        this.important = important;
        this.fileUrl = fileUrl;
        this.originalFilename = originalFilename;        
    }
}
//>>> DDD / Aggregate Root

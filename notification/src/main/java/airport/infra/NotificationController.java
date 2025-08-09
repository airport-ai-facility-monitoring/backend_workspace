package airport.infra;

import airport.domain.Notification;
import airport.domain.NotificationRepository;
import airport.domain.NotificationsRegistered;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/notifications")
@Transactional
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // 🔹 공지사항 목록 조회
    @GetMapping
    public List<Notification> getAllNotifications() {
        List<Notification> result = new ArrayList<>();
        notificationRepository.findAll().forEach(result::add);
        return result;
    }

    // 🔹 공지사항 상세 조회
    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    // 🔹 공지사항 삭제
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
    }

    // 🔹 공지사항 수정
    @PutMapping("/{id}")
    public Notification updateNotification(
            @PathVariable Long id,
            @RequestBody Notification updated
    ) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        existing.setTitle(updated.getTitle());
        existing.setContents(updated.getContents());
        existing.setImportant(updated.isImportant());
        // 작성일이나 작성자는 수정하지 않음
        return notificationRepository.save(existing);
    }

    // 🔹 공지사항 등록 (파일 업로드 포함)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Notification registerNotification(
            @RequestParam("writerId") Long writerId,
            @RequestParam("title") String title,
            @RequestParam("contents") String contents,
            @RequestParam("important") Boolean important,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        String fileUrl = null;
        String originalFilename = null;

        if (file != null && !file.isEmpty()) {
            fileUrl = fileStorageService.save(file); // 파일 저장 후 URL 생성
            originalFilename = file.getOriginalFilename();
        }

        NotificationsRegistered command = new NotificationsRegistered();
        command.setWriterId(writerId);
        command.setTitle(title);
        command.setContents(contents);
        command.setImportant(important);
        command.setWriteDate(LocalDateTime.now());

        return Notification.register(command, fileUrl, originalFilename);
    }
}
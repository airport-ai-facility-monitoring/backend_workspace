package airport.infra;

import airport.domain.Notification;
import airport.domain.NotificationRepository;
import airport.domain.NotificationsRegistered;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus; 

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/notifications")
@Transactional
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired private FileValidator fileValidator;

    private final String STORAGE_ACCOUNT_NAME = "airportfrontendstorage";
    private final String CONTAINER_NAME = "videos";

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

    // 공지사항 수정
    // @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // public Notification updateNotification(
    //         @PathVariable Long id,
    //         @RequestParam("title") String title,
    //         @RequestParam("contents") String contents,
    //         @RequestParam("important") Boolean important,
    //         @RequestParam(value = "removeFile", defaultValue = "false") boolean removeFile,
    //         @RequestParam(value = "file", required = false) MultipartFile file
    // ) {
    //     System.out.printf("[UPDATE] id=%d, title=%s, removeFile=%s, hasFile=%s%n",
    //     id, title, removeFile, (file != null && !file.isEmpty()));

    //     Notification existing = notificationRepository.findById(id)
    //             .orElseThrow(() -> new RuntimeException("Notification not found"));

    //     String fileUrl = existing.getFileUrl();
    //     String originalFilename = existing.getOriginalFilename();

    //     if (file != null && !file.isEmpty()) {
    //         // ✅ 교체: 기존 파일 삭제 + 새 파일 저장
    //         fileUrl = fileStorageService.save(file, existing.getFileUrl());
    //         originalFilename = file.getOriginalFilename();

    //     } else if (removeFile) {
    //         // ✅ 삭제만
    //         if (fileUrl != null && !fileUrl.isEmpty()) {
    //             fileStorageService.deleteByUrl(fileUrl);
    //         }
    //         fileUrl = null;
    //         originalFilename = null;

    //     } // ✅ 유지: 아무 것도 안 함

    //     existing.setTitle(title);
    //     existing.setContents(contents);
    //     existing.setImportant(important);
    //     existing.setFileUrl(fileUrl);
    //     existing.setOriginalFilename(originalFilename);

    //     return notificationRepository.save(existing);
    // }
    @PutMapping(value = "/{id}")
    public ResponseEntity<String> updateNotification(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("contents") String contents,
            @RequestParam("important") Boolean important,
            @RequestParam("filename") String filename
    ) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));


        String url = fileStorageService.save(existing, filename);

        existing.setTitle(title);
        existing.setContents(contents);
        existing.setImportant(important);
        existing.setOriginalFilename(filename);

        notificationRepository.save(existing);

        return ResponseEntity.ok(url); // URL만 반환
    }

    @PostMapping()
    public ResponseEntity<String> registerNotification(
            @RequestParam("writerId") Long writerId,
            @RequestParam("title") String title,
            @RequestParam("contents") String contents,
            @RequestParam("important") Boolean important,
            @RequestParam("filename") String originalFilename
    ) {
        Notification notification = new Notification();
        notification.setWriterId(writerId);
        notification.setTitle(title);
        notification.setContents(contents);
        notification.setImportant(important);
        notification.setOriginalFilename(originalFilename);

        // 파일 저장 후 URL
        String url = fileStorageService.save(notification, originalFilename);
        notification.setFileUrl(url);

        LocalDateTime now = LocalDateTime.now();
        ZonedDateTime koreanTime = now.atZone(ZoneId.systemDefault())
                                    .withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        notification.setWriteDate(koreanTime);

        notificationRepository.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(url); // URL만 반환
    }

    @DeleteMapping("/{id}/file")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        String fileUrl = existing.getFileUrl();
        if (fileUrl != null && !fileUrl.isEmpty()) {
            // 실제 파일 삭제
            fileStorageService.deleteByUrl(fileUrl);

            // DB에서 파일 관련 정보 제거
            existing.setFileUrl(null);
            existing.setOriginalFilename(null);
            notificationRepository.save(existing);
        }

        return ResponseEntity.noContent().build();
    }

}
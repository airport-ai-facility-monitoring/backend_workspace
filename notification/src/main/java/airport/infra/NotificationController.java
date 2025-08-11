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
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Notification updateNotification(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("contents") String contents,
            @RequestParam("important") Boolean important,
            @RequestParam(value = "removeFile", defaultValue = "false") boolean removeFile,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // DB에는 savedName을 fileUrl 필드에 넣어두는 형태 유지
        String savedName = existing.getFileUrl();
        String originalFilename = existing.getOriginalFilename();
        

        // (권장) 둘 다 동시에 요청되면 명확히 막기
        if (removeFile && file != null && !file.isEmpty()) {
            throw new IllegalArgumentException("파일 교체와 삭제는 동시에 요청할 수 없습니다.");
        }

        if (file != null && !file.isEmpty()) {
            // ✅ 업로드 전 서버 검증(크기/확장자/MIME)
            fileValidator.validateOne(file);

            // ✅ 교체: 기존 파일 삭제 + 새 파일 저장(서비스에서 old 삭제 처리)
            savedName = fileStorageService.save(file, existing.getFileUrl());
            originalFilename = file.getOriginalFilename();

        } else if (removeFile) {
            // ✅ 삭제만: 실제 파일과 DB 정보 제거
            if (savedName != null && !savedName.isBlank()) {
                fileStorageService.deleteByUrl(savedName);
            }
            savedName = null;
            originalFilename = null;
        }
        // ✅ 유지: 아무 것도 안 함

        existing.setTitle(title);
        existing.setContents(contents);
        existing.setImportant(important);
        existing.setFileUrl(savedName);            // savedName 저장
        existing.setOriginalFilename(originalFilename);

        return notificationRepository.save(existing);
    }

    // 🔹 공지사항 등록 (파일 업로드 포함)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Notification registerNotification(
    //         @RequestParam("writerId") Long writerId,
    //         @RequestParam("title") String title,
    //         @RequestParam("contents") String contents,
    //         @RequestParam("important") Boolean important,
    //         @RequestParam(value = "file", required = false) MultipartFile file
    // ) {
    //     String fileUrl = null;
    //     String originalFilename = null;

    //     if (file != null && !file.isEmpty()) {
    //         fileUrl = fileStorageService.save(file); // 파일 저장 후 URL 생성
    //         originalFilename = file.getOriginalFilename();
    //     }

            @RequestParam("writerId") Long writerId,
            @RequestParam("title") String title,
            @RequestParam("contents") String contents,
            @RequestParam("important") Boolean important,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        String savedName = null;
        String originalFilename = null;

        if (file != null && !file.isEmpty()) {
            fileValidator.validateOne(file);         // ✅ 검증
            savedName = fileStorageService.save(file); // ✅ savedName 반환
            originalFilename = file.getOriginalFilename();
        }

        NotificationsRegistered command = new NotificationsRegistered();
        command.setWriterId(writerId);
        command.setTitle(title);
        command.setContents(contents);
        command.setImportant(important);
        LocalDateTime now = LocalDateTime.now();
        ZonedDateTime koreanTime = now.atZone(ZoneId.systemDefault()).withZoneSameInstant(ZoneId.of("Asia/Seoul"));
        command.setWriteDate(koreanTime);

        return Notification.register(command, savedName, originalFilename);
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

    @GetMapping("/{id}/files/{fileName}")
    public ResponseEntity<?> download(@PathVariable Long id, @PathVariable String fileName) {
        var res = fileStorageService.loadAsResource(fileName);
        if (res == null) return ResponseEntity.notFound().build();

        // DB에서 originalFilename 찾아서 Content-Disposition에 사용 (생략시 fileName 사용)
        String downloadName = "attachment";
        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=\"" + downloadName + "\"")
            .body(res);
    }
}
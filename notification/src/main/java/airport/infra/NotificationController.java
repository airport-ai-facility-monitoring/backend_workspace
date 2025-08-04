package airport.infra;

import airport.domain.*;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

//<<< Clean Arch / Inbound Adaptor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value="/notifications")
@Transactional
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // 🔹 목록 조회
    @GetMapping
    public List<Notification> getAllNotifications() {
        List<Notification> result = new ArrayList<>();
        notificationRepository.findAll().forEach(result::add);
        return result;
    }

    // 🔹 상세 조회
    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    // 🔹 삭제
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
    }

    // 🔹 수정
    @PutMapping("/{id}")
    public Notification updateNotification(
        @PathVariable Long id,
        @RequestBody Notification updated
    ) {
        Notification existing = notificationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Notification not found"));

        existing.setTitle(updated.getTitle());
        existing.setContents(updated.getContents());
        // 작성자와 작성일은 수정하지 않는다고 가정
        return notificationRepository.save(existing);
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Notification registerNotification(
        @RequestParam("writerId") Long writerId,
        @RequestParam("title") String title,
        @RequestParam("contents") String contents,
        @RequestParam("important") boolean important,
        @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        String fileUrl = null;

        if (file != null && !file.isEmpty()) {
            fileUrl = fileStorageService.save(file); // 저장 후 URL 반환 (FileStorageService는 별도 구성됨)
        }

        NotificationsRegistered command = new NotificationsRegistered();
        command.setWriterId(writerId);
        command.setTitle(title);
        command.setContents(contents);
        command.setImportant(important);
        command.setWriteDate(LocalDateTime.now());

        return Notification.register(command, fileUrl);
    }

    // @PostMapping    
    // public Notification registerNotification(@RequestBody NotificationsRegistered command) {
    //     Notification notification = new Notification();
    //     notification.setWriterId(command.getWriterId());
    //     notification.setTitle(command.getTitle());
    //     notification.setContents(command.getContents());
    //     notification.setWriteDate(LocalDateTime.now());

    //     return notificationRepository.save(notification);
    //     // return Notification.register(command);
    // }

    // // -------------------------------------
    // // public NotificationController(NotificationRepository notificationRepository) {
    // //     this.notificationRepository = notificationRepository;
    // // }

    // 목록 조회 with 검색, 정렬, 필터, 페이징
    // @GetMapping
    // public Page<Notification> getNotifications(
    //     @RequestParam(defaultValue = "0") int page,
    //     @RequestParam(defaultValue = "10") int size,
    //     @RequestParam(defaultValue = "writeDate") String sortBy,
    //     @RequestParam(defaultValue = "desc") String direction,
    //     @RequestParam(required = false) String keyword,
    //     @RequestParam(required = false) Long writerId
    // ) {
    //     Sort sort = direction.equalsIgnoreCase("desc") ?
    //         Sort.by(sortBy).descending() :
    //         Sort.by(sortBy).ascending();

    //     PageRequest pageRequest = PageRequest.of(page, size, sort);

    //     if (keyword != null && writerId != null) {
    //         return notificationRepository.findByTitleContainingOrContentsContainingAndWriterId(
    //             keyword, keyword, writerId, pageRequest
    //         );
    //     } else if (keyword != null) {
    //         return notificationRepository.findByTitleContainingOrContentsContaining(
    //             keyword, keyword, pageRequest
    //         );
    //     } else if (writerId != null) {
    //         return notificationRepository.findByWriterId(writerId, pageRequest);
    //     } else {
    //         return notificationRepository.findAll(pageRequest);
    //     }
    // }
}
//>>> Clean Arch / Inbound Adaptor

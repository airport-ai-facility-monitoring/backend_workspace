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

//<<< Clean Arch / Inbound Adaptor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value="/notifications")
@Transactional
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

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

    @PostMapping
    public Notification registerNotification(@RequestBody NotificationsRegistered command) {
        return Notification.register(command);
    }
}
//>>> Clean Arch / Inbound Adaptor

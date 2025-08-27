package airport.domain.alertapi;

import airport.domain.Alert;
import airport.domain.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.data.domain.Sort; // 올바른 위치로 이동

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    AlertRepository alertRepository;

    // SSE Emitter를 관리하는 리스트
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    

    // 새로운 알림이 발생했을 때 호출될 메소드
    public void sendNewAlert(Alert alert) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("newAlert").data(alert));
            } catch (IOException e) {
                // 에러 발생 시 해당 emitter 제거
                emitters.remove(emitter);
            }
        }
    }

    @GetMapping
    public Iterable<Alert> getAllAlerts() {
        return alertRepository.findAll(Sort.by(Sort.Direction.DESC, "alertDate"));
    }

    // GET /alerts/search/findByCctvId?cctvId=3
    @GetMapping("/search/findByCctvId")
    public ResponseEntity<List<Alert>> getAlertsByCctvId(@RequestParam Long cctvId) {
        List<Alert> alerts = alertRepository.findByCctvId(cctvId);

        if (alerts.isEmpty()) {
            return ResponseEntity.noContent().build(); // 데이터 없으면 204 No Content
        } else {
            return ResponseEntity.ok(alerts); // 데이터 있으면 200 OK
        }
    }
}
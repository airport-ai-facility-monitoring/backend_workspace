package airport.domain.alertapi;

import airport.domain.Alert;
import airport.domain.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    @Autowired
    AlertRepository alertRepository;

    // SSE Emitter를 관리하는 리스트
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping
    public List<Alert> getAllAlerts() {
        return StreamSupport.stream(alertRepository.findAll().spliterator(), false).collect(Collectors.toList());
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAlerts() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // 타임아웃 무한대 설정
        this.emitters.add(emitter);

        // 연결이 끊어졌을 때 emitter 제거
        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
        emitter.onError((e) -> this.emitters.remove(emitter));

        // 초기 데이터 전송 (선택 사항)
        // try {
        //     emitter.send(SseEmitter.event().name("initial").data(alertRepository.findAll()));
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }

        return emitter;
    }

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
}
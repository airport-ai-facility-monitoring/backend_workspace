package airport.infra;

import airport.config.kafka.KafkaProcessor;
import airport.domain.AlertService;
import airport.domain.ForeignObjectDetected;
import airport.domain.WorkNotInProgress;
import airport.domain.WorkerCountExceeded;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PolicyHandler {

    private final AlertService alertService;

    @StreamListener(KafkaProcessor.INPUT)
    public void whenever(@Payload String eventString) {
        ObjectMapper om = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            Map<String, Object> map = om.readValue(eventString, Map.class);
            String eventType = (String) map.get("eventType");

            System.out.println("##### KAFKA RECEIVED: " + eventString);

            switch (eventType) {
                case "ForeignObjectDetected":
                    ForeignObjectDetected fod = om.readValue(eventString, ForeignObjectDetected.class);
                    alertService.handleForeignObject(fod);
                    break;
                case "WorkerCountExceeded":
                    WorkerCountExceeded wce = om.readValue(eventString, WorkerCountExceeded.class);
                    alertService.handleWorkerCountExceeded(wce);
                    break;
                case "WorkNotInProgress":
                    WorkNotInProgress wnip = om.readValue(eventString, WorkNotInProgress.class);
                    alertService.handleWorkNotInProgress(wnip);
                    break;
                default:
                    System.out.println("[PolicyHandler] Unknown eventType=" + eventType);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

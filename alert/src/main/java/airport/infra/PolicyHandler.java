package airport.infra;

import airport.config.kafka.KafkaProcessor;
import airport.domain.Alert;
import airport.domain.ForeignObjectDetected;
import airport.domain.WorkNotInProgress;
import airport.domain.WorkerCountExceeded;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PolicyHandler {

    @StreamListener(KafkaProcessor.INPUT)
    public void whenever(@Payload String eventString) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        try {
            // 이벤트 타입만 먼저 확인
            Map<String, Object> eventMap = objectMapper.readValue(eventString, Map.class);
            String eventType = (String) eventMap.get("eventType");

            System.out.println("##### KAFKA RECEIVED: " + eventString);

            // 이벤트 타입에 따라 분기 처리
            if ("ForeignObjectDetected".equals(eventType)) {
                ForeignObjectDetected event = objectMapper.readValue(eventString, ForeignObjectDetected.class);
                Alert.sendAlert(event);
            }
            else if ("WorkerCountExceeded".equals(eventType)) {
                WorkerCountExceeded event = objectMapper.readValue(eventString, WorkerCountExceeded.class);
                Alert.sendAlert(event);
            }
            else if ("WorkNotInProgress".equals(eventType)) {
                WorkNotInProgress event = objectMapper.readValue(eventString, WorkNotInProgress.class);
                Alert.sendAlert(event);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


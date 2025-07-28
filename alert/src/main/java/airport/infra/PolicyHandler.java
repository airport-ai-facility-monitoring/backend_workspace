package airport.infra;

import airport.config.kafka.KafkaProcessor;
import airport.domain.*;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.naming.NameParser;
import javax.naming.NameParser;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

//<<< Clean Arch / Inbound Adaptor
@Service
@Transactional
public class PolicyHandler {

    @Autowired
    AlertRepository alertRepository;

    @Autowired
    CctvRepository cctvRepository;

    @StreamListener(KafkaProcessor.INPUT)
    public void whatever(@Payload String eventString) {}

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='DangerDetected'"
    )
    public void wheneverDangerDetected_SendAlert(
        @Payload DangerDetected dangerDetected
    ) {
        DangerDetected event = dangerDetected;
        System.out.println(
            "\n\n##### listener SendAlert : " + dangerDetected + "\n\n"
        );

        // Sample Logic //
        Alert.sendAlert(event);
    }

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='WorkerCountExceeded'"
    )
    public void wheneverWorkerCountExceeded_SendAlert(
        @Payload WorkerCountExceeded workerCountExceeded
    ) {
        WorkerCountExceeded event = workerCountExceeded;
        System.out.println(
            "\n\n##### listener SendAlert : " + workerCountExceeded + "\n\n"
        );

        // Sample Logic //
        Alert.sendAlert(event);
    }

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='WorkTimeNotMatched'"
    )
    public void wheneverWorkTimeNotMatched_SendAlert(
        @Payload WorkTimeNotMatched workTimeNotMatched
    ) {
        WorkTimeNotMatched event = workTimeNotMatched;
        System.out.println(
            "\n\n##### listener SendAlert : " + workTimeNotMatched + "\n\n"
        );

        // Sample Logic //
        Alert.sendAlert(event);
    }

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='DamageDetected'"
    )
    public void wheneverDamageDetected_SendAlert(
        @Payload DamageDetected damageDetected
    ) {
        DamageDetected event = damageDetected;
        System.out.println(
            "\n\n##### listener SendAlert : " + damageDetected + "\n\n"
        );

        // Sample Logic //
        Alert.sendAlert(event);
    }
}
//>>> Clean Arch / Inbound Adaptor

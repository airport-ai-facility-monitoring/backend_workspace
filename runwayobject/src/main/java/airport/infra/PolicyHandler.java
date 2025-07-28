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
    StrangeObjectRepository strangeObjectRepository;

    @Autowired
    WorkerRepository workerRepository;

    @Autowired
    WorkTruckRepository workTruckRepository;

    @StreamListener(KafkaProcessor.INPUT)
    public void whatever(@Payload String eventString) {}

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='WorkTruckDetected'"
    )
    public void wheneverWorkTruckDetected_CheckWorkTime(
        @Payload WorkTruckDetected workTruckDetected
    ) {
        WorkTruckDetected event = workTruckDetected;
        System.out.println(
            "\n\n##### listener CheckWorkTime : " + workTruckDetected + "\n\n"
        );

        // Sample Logic //
        WorkTruck.checkWorkTime(event);
    }

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='WorkerDetected'"
    )
    public void wheneverWorkerDetected_CheckWorkerCount(
        @Payload WorkerDetected workerDetected
    ) {
        WorkerDetected event = workerDetected;
        System.out.println(
            "\n\n##### listener CheckWorkerCount : " + workerDetected + "\n\n"
        );

        // Sample Logic //
        Worker.checkWorkerCount(event);
    }
}
//>>> Clean Arch / Inbound Adaptor

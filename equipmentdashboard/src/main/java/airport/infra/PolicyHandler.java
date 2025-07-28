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
    EquipmentRepository equipmentRepository;

    @StreamListener(KafkaProcessor.INPUT)
    public void whatever(@Payload String eventString) {}

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='MaintenanceCompleted'"
    )
    public void wheneverMaintenanceCompleted_MaintenanceComplete(
        @Payload MaintenanceCompleted maintenanceCompleted
    ) {
        MaintenanceCompleted event = maintenanceCompleted;
        System.out.println(
            "\n\n##### listener MaintenanceComplete : " +
            maintenanceCompleted +
            "\n\n"
        );

        // Sample Logic //
        Equipment.maintenanceComplete(event);
    }
}
//>>> Clean Arch / Inbound Adaptor

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

import java.util.Optional;

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
        if (!maintenanceCompleted.validate()) return;

        Optional<Equipment> equipmentOptional = equipmentRepository.findById(maintenanceCompleted.getEquipmentId());
        if (equipmentOptional.isPresent()) {
            Equipment equipment = equipmentOptional.get();
            equipment.setState("점검완료");
            equipmentRepository.save(equipment);
            System.out.println("장비 상태가 '점검완료'로 변경되었습니다.");
        }
    }
}
//>>> Clean Arch / Inbound Adaptor

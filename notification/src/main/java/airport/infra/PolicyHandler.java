package airport.infra;

import airport.config.kafka.KafkaProcessor;
import airport.domain.*;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    NotificationRepository notificationRepository;

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='NotificationsRegistered'"
    )
    public void wheneverNotificationsRegistered_Notify(
        @Payload NotificationsRegistered notificationsRegistered
    ) {
        if (!notificationsRegistered.validate()) return;
        System.out.println(
            "##### listener Notify : " + notificationsRegistered.toJson()
        );

        // Sample Logic //
        Notification.notify(notificationsRegistered);
    }

    @StreamListener(KafkaProcessor.INPUT)
    public void whatever(@Payload String eventString) {}
}
//>>> Clean Arch / Inbound Adaptor

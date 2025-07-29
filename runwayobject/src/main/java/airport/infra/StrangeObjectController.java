package airport.infra;

import airport.config.kafka.KafkaProcessor;
import airport.domain.*;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class StrangeObjectController {

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private WorkTruckRepository workTruckRepository;

    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='ObjectDetectedClassified'"
    )
    public void handleObjectDetectedClassified(@Payload ObjectDetectedClassified event) {
        Integer classId = event.getClassId();
        Integer count = event.getCount();

        switch (classId) {
            case 5: case 6: case 7: case 8: case 9: case 11:
                DangerDetected dangerDetected = new DangerDetected();
                dangerDetected.setClassId(classId);
                dangerDetected.setCount(count);
                dangerDetected.publish();
                break;
            case 10:
                long dbWorkerCount = workerRepository.count();
                if (count > dbWorkerCount) {
                    WorkerCountExceeded workerCountExceeded = new WorkerCountExceeded();
                    workerCountExceeded.setDetectedCount(count);
                    workerCountExceeded.setDbCount(dbWorkerCount);
                    workerCountExceeded.publish();
                }
                break;
            case 13: case 14: case 15: case 16: case 17:
            case 18: case 19: case 20: case 21: case 22:
                boolean timeMismatch = !workTruckRepository.isWorkTimeMatched(classId);
                if (timeMismatch) {
                    WorkTimeNotMatched workTimeNotMatched = new WorkTimeNotMatched();
                    workTimeNotMatched.setClassId(classId);
                    workTimeNotMatched.publish();
                }
                break;
            default:
                break;
        }
    }

    @Autowired
    StrangeObjectRepository strangeObjectRepository;
}
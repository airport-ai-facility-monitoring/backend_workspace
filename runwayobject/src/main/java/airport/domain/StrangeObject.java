package airport.domain;

import airport.RunwayobjectApplication;
import airport.domain.DangerDetected;
import airport.domain.ObjectDetectedClassified;
import airport.domain.WorkTruckDetected;
import airport.domain.WorkerDetected;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "StrangeObject_table")
@Data
//<<< DDD / Aggregate Root
public class StrangeObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long objId;

    private Integer objectType;

    private String imageUrl;

    private Long cctvId;

    @PostPersist
    public void onPostPersist() {
        DangerDetected dangerDetected = new DangerDetected(this);
        dangerDetected.publishAfterCommit();

        WorkTruckDetected workTruckDetected = new WorkTruckDetected(this);
        workTruckDetected.publishAfterCommit();

        ObjectDetectedClassified objectDetectedClassified = new ObjectDetectedClassified(
            this
        );
        objectDetectedClassified.publishAfterCommit();

        WorkerDetected workerDetected = new WorkerDetected(this);
        workerDetected.publishAfterCommit();
    }

    public static StrangeObjectRepository repository() {
        StrangeObjectRepository strangeObjectRepository = RunwayobjectApplication.applicationContext.getBean(
            StrangeObjectRepository.class
        );
        return strangeObjectRepository;
    }
}
//>>> DDD / Aggregate Root

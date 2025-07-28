package airport.domain;

import airport.RunwayobjectApplication;
import airport.domain.WorkTimeNotMatched;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "WorkTruck_table")
@Data
//<<< DDD / Aggregate Root
public class WorkTruck {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long workTruckId;

    private Integer workTruckType;

    private Date workStartTime;

    private Date workEndTime;

    @PostPersist
    public void onPostPersist() {
        WorkTimeNotMatched workTimeNotMatched = new WorkTimeNotMatched(this);
        workTimeNotMatched.publishAfterCommit();
    }

    public static WorkTruckRepository repository() {
        WorkTruckRepository workTruckRepository = RunwayobjectApplication.applicationContext.getBean(
            WorkTruckRepository.class
        );
        return workTruckRepository;
    }

    //<<< Clean Arch / Port Method
    public static void checkWorkTime(WorkTruckDetected workTruckDetected) {
        //implement business logic here:

        /** Example 1:  new item 
        WorkTruck workTruck = new WorkTruck();
        repository().save(workTruck);

        */

        /** Example 2:  finding and process
        

        repository().findById(workTruckDetected.get???()).ifPresent(workTruck->{
            
            workTruck // do something
            repository().save(workTruck);


         });
        */

    }
    //>>> Clean Arch / Port Method

}
//>>> DDD / Aggregate Root

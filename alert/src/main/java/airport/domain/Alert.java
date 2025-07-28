package airport.domain;

import airport.AlertApplication;
import airport.domain.AlertSent;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Alert_table")
@Data
//<<< DDD / Aggregate Root
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long alertId;

    private String alertLog;

    private Date alertDate;

    public static AlertRepository repository() {
        AlertRepository alertRepository = AlertApplication.applicationContext.getBean(
            AlertRepository.class
        );
        return alertRepository;
    }

    //<<< Clean Arch / Port Method
    public static void sendAlert(DangerDetected dangerDetected) {
        //implement business logic here:

        /** Example 1:  new item 
        Alert alert = new Alert();
        repository().save(alert);

        AlertSent alertSent = new AlertSent(alert);
        alertSent.publishAfterCommit();
        */

        /** Example 2:  finding and process
        

        repository().findById(dangerDetected.get???()).ifPresent(alert->{
            
            alert // do something
            repository().save(alert);

            AlertSent alertSent = new AlertSent(alert);
            alertSent.publishAfterCommit();

         });
        */

    }

    //>>> Clean Arch / Port Method
    //<<< Clean Arch / Port Method
    public static void sendAlert(WorkerCountExceeded workerCountExceeded) {
        //implement business logic here:

        /** Example 1:  new item 
        Alert alert = new Alert();
        repository().save(alert);

        AlertSent alertSent = new AlertSent(alert);
        alertSent.publishAfterCommit();
        */

        /** Example 2:  finding and process
        

        repository().findById(workerCountExceeded.get???()).ifPresent(alert->{
            
            alert // do something
            repository().save(alert);

            AlertSent alertSent = new AlertSent(alert);
            alertSent.publishAfterCommit();

         });
        */

    }

    //>>> Clean Arch / Port Method
    //<<< Clean Arch / Port Method
    public static void sendAlert(WorkTimeNotMatched workTimeNotMatched) {
        //implement business logic here:

        /** Example 1:  new item 
        Alert alert = new Alert();
        repository().save(alert);

        AlertSent alertSent = new AlertSent(alert);
        alertSent.publishAfterCommit();
        */

        /** Example 2:  finding and process
        

        repository().findById(workTimeNotMatched.get???()).ifPresent(alert->{
            
            alert // do something
            repository().save(alert);

            AlertSent alertSent = new AlertSent(alert);
            alertSent.publishAfterCommit();

         });
        */

    }

    //>>> Clean Arch / Port Method
    //<<< Clean Arch / Port Method
    public static void sendAlert(DamageDetected damageDetected) {
        //implement business logic here:

        /** Example 1:  new item 
        Alert alert = new Alert();
        repository().save(alert);

        AlertSent alertSent = new AlertSent(alert);
        alertSent.publishAfterCommit();
        */

        /** Example 2:  finding and process
        

        repository().findById(damageDetected.get???()).ifPresent(alert->{
            
            alert // do something
            repository().save(alert);

            AlertSent alertSent = new AlertSent(alert);
            alertSent.publishAfterCommit();

         });
        */

    }
    //>>> Clean Arch / Port Method

}
//>>> DDD / Aggregate Root

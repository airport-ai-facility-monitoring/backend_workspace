package airport.domain;

import airport.EquipmentdashboardApplication;
import airport.domain.EquipmentIAnalyRequested;
import airport.domain.EquipmentRegistered;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Equipment_table")
@Data
//<<< DDD / Aggregate Root
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long equipmentId;

    private String equipmentType;

    private String equipmentName;

    private String state;

    @PostPersist
    public void onPostPersist() {
        EquipmentRegistered equipmentRegistered = new EquipmentRegistered(this);
        equipmentRegistered.publishAfterCommit();

        EquipmentIAnalyRequested equipmentIAnalyRequested = new EquipmentIAnalyRequested(
            this
        );
        equipmentIAnalyRequested.publishAfterCommit();
    }

    public static EquipmentRepository repository() {
        EquipmentRepository equipmentRepository = EquipmentdashboardApplication.applicationContext.getBean(
            EquipmentRepository.class
        );
        return equipmentRepository;
    }

    //<<< Clean Arch / Port Method
    public static void maintenanceComplete(
        MaintenanceCompleted maintenanceCompleted
    ) {
        //implement business logic here:

        /** Example 1:  new item 
        Equipment equipment = new Equipment();
        repository().save(equipment);

        */

        /** Example 2:  finding and process
        
        // if maintenanceCompleted.equipmentLlmId exists, use it
        
        // ObjectMapper mapper = new ObjectMapper();
        // Map<, Object> equipmentReportMap = mapper.convertValue(maintenanceCompleted.getEquipmentLlmId(), Map.class);

        repository().findById(maintenanceCompleted.get???()).ifPresent(equipment->{
            
            equipment // do something
            repository().save(equipment);


         });
        */

    }
    //>>> Clean Arch / Port Method

}
//>>> DDD / Aggregate Root

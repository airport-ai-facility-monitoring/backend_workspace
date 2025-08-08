package airport.domain;

import airport.EquipmentAnalysisApplication;
import airport.domain.MaintenanceCompleted;
import airport.domain.ReportGenerated;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "EquipmentReport_table", schema = "equipmentAnalysis")
@Data
//<<< DDD / Aggregate Root
public class EquipmentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long equipReportid;

    private String title;

    private int maintenanceCost;

    private String reportContents;

    private Long equipmentId;

    private String state;

    // @PreUpdate
    // public void onPreUpdate() {
    //     MaintenanceCompleted maintenanceCompleted = new MaintenanceCompleted(
    //         this
    //     );
    //     maintenanceCompleted.publishAfterCommit();
    // }

    public static EquipmentReportRepository repository() {
        EquipmentReportRepository equipmentReportRepository = EquipmentAnalysisApplication.applicationContext.getBean(
            EquipmentReportRepository.class
        );
        return equipmentReportRepository;
    }

    public void completeInspection() {
        this.state = "점검완료";

        MaintenanceCompleted event = new MaintenanceCompleted(this);
        event.publishAfterCommit();
    }
}
//>>> DDD / Aggregate Root

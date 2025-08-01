package airport.domain;

import airport.EquipmentdashboardApplication;
import airport.domain.EquipmentIAnalyRequested;
import airport.domain.EquipmentRegistered;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
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

    private String equipmentType; // 조명, 기상, 표지판

    private String equipmentName;

    private String state;

    // 분류 column
    private String category; // REL, RCL, TDZL, REIL

    private String manufacturer; //Samsung, Honeywell, GE, LSElectric

    private String protectionRating; //IP65, IP66, IP67

    //column
    private Integer purchase;

    private LocalDateTime purchaseDate;

    private Integer failure;

    private Integer runtime;

    private Integer serviceYears;

    private Integer repairCost;

    private Integer repairTime;

    private Integer laborRate;

    private Integer avgLife;

    //이거 지금 넣는거 맞나
    private Integer maintenanceCost;

    // 조명 장비 상세
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "lighting_detail_id")
    private LightingEquipmentDetail lightingDetail;

    // 기상 장비 상세
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "weather_detail_id")
    private WeatherEquipmentDetail weatherDetail;

    // 표지판 장비 상세
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "sign_detail_id")
    private SignEquipmentDetail signDetail;



    @PostPersist
    public void onPostPersist() {
        EquipmentRegistered equipmentRegistered = new EquipmentRegistered(this);
        equipmentRegistered.publishAfterCommit();

        // 장비 등록 시점에는 분석 요청이 자동으로 발생하지 않도록 주석 처리
        // EquipmentIAnalyRequested equipmentIAnalyRequested = new EquipmentIAnalyRequested(
        //     this
        // );
        // equipmentIAnalyRequested.publishAfterCommit();
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

    public void requestAnalysis() {
        this.state = "분석요청됨";

        EquipmentIAnalyRequested event = new EquipmentIAnalyRequested(this);
        event.publishAfterCommit();
    }

}
//>>> DDD / Aggregate Root

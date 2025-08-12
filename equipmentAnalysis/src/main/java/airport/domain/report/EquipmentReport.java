package airport.domain.report;

import airport.EquipmentAnalysisApplication;
// import airport.domain.MaintenanceCompleted;
// import airport.domain.ReportGenerated;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "EquipmentReport_table")
@Data
//<<< DDD / Aggregate Root
public class EquipmentReport {
    /**
     * 리포트의 고유 식별자(Primary Key)입니다.
     * `@Id` 어노테이션으로 기본 키 필드임을 나타냅니다.
     * `@GeneratedValue`는 기본 키 값을 자동으로 생성하도록 설정합니다. (IDENTITY 전략 사용)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * LLM이 분석한 예상 유지보수 조치 내용입니다.
     * (예: "램프 교체", "패널 세척")
     */
    private String action;

    /**
     * 장비의 폐기/교체/유지 여부에 대한 LLM의 결정과 그 사유입니다.
     * (예: "수리 비용이 신규 구매 비용보다 저렴하여 유지보수 후 계속 사용 권장")
     */
    private String decision;

    /**
     * 예상되는 조치 비용에 대한 정보입니다.
     * (예: "총 50,000원")
     */
    private String cost;

     // LLM이 만들어준 전체 보고서 본문
    @Column(columnDefinition = "TEXT")
    private String llmReport;      // ✅ 프론트에서 편집한 텍스트를 그대로 저장

    // (선택) 디버깅용
    @Column(columnDefinition = "TEXT")
    private String rawJson;

    // (선택) 메타들 저장해두면 상세에서 다시 호출 없이 표시 가능
    private String category;
    private String manufacturer;
    private Integer purchase;
    private String protectionRating;
    private Integer failure;
    private Integer runtime;
    private Integer serviceYears;
    private Integer maintenanceCostNum;
    private Integer repairCost;
    private Integer repairTime;
    private Integer laborRate;
    private Integer avgLife;

    // @PreUpdate
    // public void onPreUpdate() {
    //     MaintenanceCompleted maintenanceCompleted = new MaintenanceCompleted(
    //         this
    //     );
    //     maintenanceCompleted.publishAfterCommit();
    // }

//     public static EquipmentReportRepository repository() {
//         EquipmentReportRepository equipmentReportRepository = EquipmentAnalysisApplication.applicationContext.getBean(
//             EquipmentReportRepository.class
//         );
//         return equipmentReportRepository;
//     }

//     public void completeInspection() {
//         this.state = "점검완료";

//         MaintenanceCompleted event = new MaintenanceCompleted(this);
//         event.publishAfterCommit();
//     }
}
//>>> DDD / Aggregate Root

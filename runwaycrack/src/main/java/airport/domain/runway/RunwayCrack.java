// package airport.domain.runway;

// import airport.RunwaycrackApplication;
// import airport.domain.DamageDetected;
// import airport.domain.ReportRequested;
// import airport.domain.report.RunwayCrackReport;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import java.time.LocalDate;
// import java.util.Collections;
// import java.util.Date;
// import java.util.List;
// import java.util.Map;
// import javax.persistence.*;
// import lombok.Data;

// @Entity
// @Table(name = "RunwayCrack_table", schema = "runwaycrack")
// @Data
// //<<< DDD / Aggregate Root
// public class RunwayCrack {

//     @Id
//     @GeneratedValue(strategy = GenerationType.AUTO)
//     private Long rcId;

//     private String imageUrl;
//     private Long cctvId;
//     private Integer length; // 파손 길이 (cm)
//     private Integer area;   // 파손 면적 (cm²)
//     private LocalDate detectedDate;
//     private Boolean reportState;

//     @PostPersist
//     public void onPostPersist() {
//         DamageDetected damageDetected = new DamageDetected(this);
//         damageDetected.publishAfterCommit();
//     }

//     public static RunwayCrackRepository repository() {
//         RunwayCrackRepository runwayCrackRepository = RunwaycrackApplication.applicationContext.getBean(
//             RunwayCrackRepository.class
//         );
//         return runwayCrackRepository;
//     }
// }
// //>>> DDD / Aggregate Root
package airport.domain.runway;

import airport.RunwaycrackApplication;
import airport.domain.DamageDetected;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "RunwayCrack_table", schema = "runwaycrack")
@Data
public class RunwayCrack {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rcId;

    private String imageUrl;
    @Column(unique = true )
    private Long cctvId;
    private Double lengthCm;      // 파손 길이 (cm)
    private Double areaCm2;       // 파손 면적 (cm²)
    private Double avgWidthCm;    // 평균 폭 (cm) = (area_m2 * 10000) / length_cm
    private Double repairAreaM2;  // 보수 면적 (m²) = area_m2 * repair_factor
    private Boolean pavementTypeConcrete; // 콘크리트 여부
    private Boolean epoxyUsed;
    private Boolean wiremeshUsed;
    private Boolean jointSealUsed;
    private Boolean rebarUsed;
    private Boolean polymerUsed;
    private Boolean sealingUsed;

    private LocalDate detectedDate;
    private Boolean reportState;

    @PostPersist
    public void onPostPersist() {
        DamageDetected damageDetected = new DamageDetected(this);
        damageDetected.publishAfterCommit();
    }

    public static RunwayCrackRepository repository() {
        return RunwaycrackApplication.applicationContext.getBean(RunwayCrackRepository.class);
    }
}
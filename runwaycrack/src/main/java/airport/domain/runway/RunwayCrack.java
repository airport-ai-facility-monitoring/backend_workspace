package airport.domain.runway;

import airport.RunwaycrackApplication;
import airport.domain.DamageDetected;
import airport.domain.ReportRequested;
import airport.domain.report.RunwayCrackReport;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "RunwayCrack_table")
@Data
//<<< DDD / Aggregate Root
public class RunwayCrack {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rcId;

    private String imageUrl;

    private Long cctvId;

    private Integer length; // 파손 길이 (cm)

    private Integer area; // 파손 면적 (cm²)

    
    @Column(length = 4000)
    private String damageDetails;

    private Boolean reportState;

    private LocalDate detectedDate;

    @OneToOne(mappedBy = "runwayCrack", cascade = CascadeType.ALL)
    private RunwayCrackReport report;

    @PostPersist
    public void onPostPersist() {
        DamageDetected damageDetected = new DamageDetected(this);
        damageDetected.publishAfterCommit();
    }

    public static RunwayCrackRepository repository() {
        RunwayCrackRepository runwayCrackRepository = RunwaycrackApplication.applicationContext.getBean(
            RunwayCrackRepository.class
        );
        return runwayCrackRepository;
    }
}
//>>> DDD / Aggregate Root

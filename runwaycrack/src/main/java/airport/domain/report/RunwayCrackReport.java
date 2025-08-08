package airport.domain.report;

import airport.RunwaycrackApplication;
import airport.domain.runway.RunwayCrack;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "RunwayCrackReport_table", schema = "runwaycrack")
@Data
@ToString
//<<< DDD / Aggregate Root
public class RunwayCrackReport {

    @Id
    private Long rcReportid;

    @OneToOne
    @JoinColumn(name = "rc_id")
    @JsonIgnore
    private RunwayCrack runwayCrack;

    private String title;

    private String crackType;

    private String cause;

    private String damageSeverity;

    @Column(length = 1000)
    private String riskAssessment;

    private Integer repairPeriod;

    private Integer repairCost;

    @Column(length = 1000)
    private String repairRecommendation;

    @Column(length = 4000)
    private String reportContents;

    public static RunwayCrackReportRepository repository() {
        RunwayCrackReportRepository runwayCrackReportRepository = RunwaycrackApplication.applicationContext.getBean(
            RunwayCrackReportRepository.class
        );
        return runwayCrackReportRepository;
    }
}
//>>> DDD / Aggregate Root

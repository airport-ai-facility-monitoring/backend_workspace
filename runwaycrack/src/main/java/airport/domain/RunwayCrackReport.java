package airport.domain;

import airport.RunwaycrackApplication;
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
@Table(name = "RunwayCrackReport_table")
@Data
//<<< DDD / Aggregate Root
public class RunwayCrackReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rcReportid;

    private String title;

    private Integer repairPeriod;

    private Integer repairCost;

    private String cause;

    private String reportContents;

    public static RunwayCrackReportRepository repository() {
        RunwayCrackReportRepository runwayCrackReportRepository = RunwaycrackApplication.applicationContext.getBean(
            RunwayCrackReportRepository.class
        );
        return runwayCrackReportRepository;
    }
}
//>>> DDD / Aggregate Root

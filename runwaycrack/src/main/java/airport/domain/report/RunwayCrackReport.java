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
public class RunwayCrackReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rcReportid;

    @Column(unique = true)
    private Long crackId;

    @Column(length = 500, columnDefinition = "NVARCHAR(500)")
    private String title;

    @Column(length = 500, columnDefinition = "NVARCHAR(500)")
    private String damageInfo;

    @Column(length = 500, columnDefinition = "NVARCHAR(500)")
    private String repairMaterials;

    @Column(length = 500, columnDefinition = "NVARCHAR(500)")
    private String estimatedCost;

    @Column(length = 500, columnDefinition = "NVARCHAR(500)")
    private String estimatedPeriod;

    @Column(length = 1000, columnDefinition = "NVARCHAR(1000)")
    private String summary;

    private LocalDate WritingDate;

    private Long employeeId;
    
    public static RunwayCrackReportRepository repository() {
        RunwayCrackReportRepository runwayCrackReportRepository = RunwaycrackApplication.applicationContext.getBean(
            RunwayCrackReportRepository.class
        );
        return runwayCrackReportRepository;
    }
}
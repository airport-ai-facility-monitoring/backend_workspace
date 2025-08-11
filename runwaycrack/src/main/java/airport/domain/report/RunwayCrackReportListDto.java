package airport.domain.report;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import airport.RunwaycrackApplication;
import lombok.Data;

@Data
public class RunwayCrackReportListDto {
    
    private Long rcReportId;

    private Long cctvId;

    private Long crackId;

    private String title;

    private Long employeeId;

    private LocalDate WritingDate;

    private LocalDate detectedDate;

}


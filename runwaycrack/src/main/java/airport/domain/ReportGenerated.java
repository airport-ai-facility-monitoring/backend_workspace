package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class ReportGenerated extends AbstractEvent {

    private Long rcReportid;
    private String title;
    private Integer repairPeriod;
    private Integer repairCost;
    private String cause;
    private String reportContents;

    public ReportGenerated(RunwayCrackReport aggregate) {
        super(aggregate);
    }

    public ReportGenerated() {
        super();
    }
}
//>>> DDD / Domain Event

package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class WorkerCountExceeded extends AbstractEvent {

    private Long workerId;
    private String workArea;
    private Integer approvalWorkerCount;
    private Date workStartTime;
    private Date workEndTime;
    private Long cctvId;

    public WorkerCountExceeded(Worker aggregate) {
        super(aggregate);
    }

    public WorkerCountExceeded() {
        super();
    }
}
//>>> DDD / Domain Event

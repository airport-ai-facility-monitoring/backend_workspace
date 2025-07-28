package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.util.*;
import lombok.*;

@Data
@ToString
public class WorkerCountExceeded extends AbstractEvent {

    private Long workerId;
    private String workArea;
    private Integer approvalWorkerCount;
    private Date workStartTime;
    private Date workEndTime;
    private Long cctvId;
}

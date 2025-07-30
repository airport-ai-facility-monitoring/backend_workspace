package airport.domain;

import airport.infra.AbstractEvent;
import java.util.Date;
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
    private Integer detectedCount;
    private Long dbCount;

    public WorkerCountExceeded(Worker aggregate) {
        super(aggregate);
    }

    public WorkerCountExceeded() {
        super();
    }

    public Integer getDetectedCount() {
        return detectedCount;
    }

    public void setDetectedCount(Integer detectedCount) {
        this.detectedCount = detectedCount;
    }

    public Long getDbCount() {
        return dbCount;
    }

    public void setDbCount(Long dbCount) {
        this.dbCount = dbCount;
    }
}
//>>> DDD / Domain Event

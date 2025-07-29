package airport.domain;

import airport.infra.AbstractEvent;
import java.util.Date;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class WorkTimeNotMatched extends AbstractEvent {

    private Long workTruckId;
    private Integer workTruckType;
    private Date workStartTime;
    private Date workEndTime;
    private Long cctvId;
    private Integer classId;

    public WorkTimeNotMatched(WorkTruck aggregate) {
        super(aggregate);
    }

    public WorkTimeNotMatched() {
        super();
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }
}
// >>> DDD / Domain Event

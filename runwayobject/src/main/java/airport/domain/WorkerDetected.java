package airport.domain;

import airport.infra.AbstractEvent;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class WorkerDetected extends AbstractEvent {

    private Long objId;
    private Integer objectType;
    private String imageUrl;
    private Long cctvId;
    private Integer count;

    public WorkerDetected(StrangeObject aggregate) {
        super(aggregate);
    }

    public WorkerDetected() {
        super();
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
//>>> DDD / Domain Event

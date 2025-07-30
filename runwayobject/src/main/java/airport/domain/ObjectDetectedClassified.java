package airport.domain;

import airport.infra.AbstractEvent;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class ObjectDetectedClassified extends AbstractEvent {

    private Long objId;
    private Integer objectType;
    private String imageUrl;
    private Long cctvId;
    private Integer classId;
    private Integer count;

    public ObjectDetectedClassified(StrangeObject aggregate) {
        super(aggregate);
    }

    public ObjectDetectedClassified() {
        super();
    }

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
//>>> DDD / Domain Event

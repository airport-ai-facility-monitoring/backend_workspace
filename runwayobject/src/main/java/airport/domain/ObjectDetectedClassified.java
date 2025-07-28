package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class ObjectDetectedClassified extends AbstractEvent {

    private Long objId;
    private Integer objectType;
    private String imageUrl;
    private Long cctvId;

    public ObjectDetectedClassified(StrangeObject aggregate) {
        super(aggregate);
    }

    public ObjectDetectedClassified() {
        super();
    }
}
//>>> DDD / Domain Event

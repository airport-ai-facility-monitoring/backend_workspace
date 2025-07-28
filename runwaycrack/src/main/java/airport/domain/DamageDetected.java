package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class DamageDetected extends AbstractEvent {

    private Long rcId;
    private String imageUrl;
    private Long cctvId;
    private Integer size;

    public DamageDetected(RunwayCrack aggregate) {
        super(aggregate);
    }

    public DamageDetected() {
        super();
    }
}
//>>> DDD / Domain Event

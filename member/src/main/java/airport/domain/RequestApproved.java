package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class RequestApproved extends AbstractEvent {

    private Long id;
    private String password;
    private Long employeeId;

    public RequestApproved(User aggregate) {
        super(aggregate);
    }

    public RequestApproved() {
        super();
    }
}
//>>> DDD / Domain Event

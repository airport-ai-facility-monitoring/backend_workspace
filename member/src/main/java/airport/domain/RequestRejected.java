package airport.domain;

import airport.domain.*;
import airport.domain.User.User;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class RequestRejected extends AbstractEvent {

    private Long id;
    private String password;
    private Employee employee;

    public RequestRejected(User aggregate) {
        super(aggregate);
    }

    public RequestRejected() {
        super();
    }
}
//>>> DDD / Domain Event

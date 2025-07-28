package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.time.LocalDate;
import java.util.*;
import lombok.*;

//<<< DDD / Domain Event
@Data
@ToString
public class SignupRequested extends AbstractEvent {

    private Long id;
    private String password;
    private Long employeeId;

    public SignupRequested(User aggregate) {
        super(aggregate);
    }

    public SignupRequested() {
        super();
    }
}
//>>> DDD / Domain Event

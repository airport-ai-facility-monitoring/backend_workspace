package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.util.*;
import lombok.*;

@Data
@ToString
public class DangerDetected extends AbstractEvent {

    private Long objId;
    private Integer objectType;
    private String imageUrl;
    private Long cctvId;
}

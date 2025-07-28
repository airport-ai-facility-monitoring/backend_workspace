package airport.domain;

import airport.domain.*;
import airport.infra.AbstractEvent;
import java.util.*;
import lombok.*;

@Data
@ToString
public class DamageDetected extends AbstractEvent {

    private Long rcId;
    private String imageUrl;
    private Long cctvId;
    private Integer size;
}

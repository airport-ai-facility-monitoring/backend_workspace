package airport.domain;

import lombok.Data;

@Data
public class WorkNotInProgress {
    private String eventType;
    private Long cameraId;
    private String objectType;
    private Integer objectCount;
}

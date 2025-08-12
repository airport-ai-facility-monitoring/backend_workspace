package airport.domain;

import lombok.Data;

@Data
public class WorkerCountExceeded {
    private String eventType;
    private Long cameraId; // Changed from cctvId to cameraId
    private Integer workerCount;
    private Integer limit;
}

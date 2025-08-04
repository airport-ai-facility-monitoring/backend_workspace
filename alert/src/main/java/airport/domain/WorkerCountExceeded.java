package airport.domain;

import lombok.Data;

@Data
public class WorkerCountExceeded {
    private String eventType;
    private Long cctvId; // cctvId 필드 추가
    private Integer workerCount;
    private Integer limit;
}

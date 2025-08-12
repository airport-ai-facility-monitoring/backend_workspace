package airport.domain;

import airport.RunwayobjectApplication;
import airport.domain.WorkerCountExceeded;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Worker_table", schema = "runwayobject")
@Data
//<<< DDD / Aggregate Root
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long workerId;

    private String workArea;

    private Integer approvalWorkerCount;

    private Date workStartTime;

    private Date workEndTime;

    public static WorkerRepository repository() {
        WorkerRepository workerRepository = RunwayobjectApplication.applicationContext.getBean(
            WorkerRepository.class
        );
        return workerRepository;
    }

    //<<< Clean Arch / Port Method
    public static void checkWorkerCount(WorkerDetected workerDetected) {
        Integer totalApprovalWorkerCount = repository().getTotalApprovalWorkerCount();
        if (workerDetected.getCount() > totalApprovalWorkerCount) {
            WorkerCountExceeded workerCountExceeded = new WorkerCountExceeded();
            workerCountExceeded.setDetectedCount(workerDetected.getCount());
            workerCountExceeded.setDbCount(Long.valueOf(totalApprovalWorkerCount));
            workerCountExceeded.publishAfterCommit();
        }
    }
    //>>> Clean Arch / Port Method

}
//>>> DDD / Aggregate Root

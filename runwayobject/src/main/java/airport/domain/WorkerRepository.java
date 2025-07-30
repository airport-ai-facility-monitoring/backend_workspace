package airport.domain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "workers", path = "workers")
public interface WorkerRepository
    extends PagingAndSortingRepository<Worker, Long> {
    @Query("SELECT SUM(w.approvalWorkerCount) FROM Worker w")
    Integer getTotalApprovalWorkerCount();
}

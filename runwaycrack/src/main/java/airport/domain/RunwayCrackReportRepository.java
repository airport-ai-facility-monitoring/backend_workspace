package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "runwayCrackReports",
    path = "runwayCrackReports"
)
public interface RunwayCrackReportRepository
    extends PagingAndSortingRepository<RunwayCrackReport, Long> {}

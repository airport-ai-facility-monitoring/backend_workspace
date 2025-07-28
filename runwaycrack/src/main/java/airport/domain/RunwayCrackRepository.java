package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "runwayCracks",
    path = "runwayCracks"
)
public interface RunwayCrackRepository
    extends PagingAndSortingRepository<RunwayCrack, Long> {}

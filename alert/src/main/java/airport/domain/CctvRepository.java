package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "cctvs", path = "cctvs")
public interface CctvRepository
    extends PagingAndSortingRepository<Cctv, Long> {}

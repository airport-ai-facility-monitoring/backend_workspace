package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "workTrucks",
    path = "workTrucks"
)
public interface WorkTruckRepository
    extends PagingAndSortingRepository<WorkTruck, Long> {}

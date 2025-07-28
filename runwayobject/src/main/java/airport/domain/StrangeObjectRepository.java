package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "strangeObjects",
    path = "strangeObjects"
)
public interface StrangeObjectRepository
    extends PagingAndSortingRepository<StrangeObject, Long> {}

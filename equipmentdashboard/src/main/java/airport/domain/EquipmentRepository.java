package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "equipment", path = "equipment")
public interface EquipmentRepository
    extends PagingAndSortingRepository<Equipment, Long> {}

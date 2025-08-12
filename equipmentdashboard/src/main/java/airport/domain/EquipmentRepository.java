package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.jpa.repository.JpaRepository;
//<<< PoEAA / Repository
public interface EquipmentRepository
    extends JpaRepository<Equipment, Long> {}
 
package airport.domain;

import airport.domain.*;
import java.util.List;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "alerts", path = "alerts")
public interface AlertRepository
    extends PagingAndSortingRepository<Alert, Long> {
    List<Alert> findByCctvId(@Param("cctvId") Long cctvId);
}

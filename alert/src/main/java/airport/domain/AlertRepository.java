package airport.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(collectionResourceRel = "alerts", path = "alerts")
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByCctvId(@Param("cctvId") Long cctvId);
}

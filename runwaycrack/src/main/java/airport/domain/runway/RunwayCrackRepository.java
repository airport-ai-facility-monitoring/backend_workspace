package airport.domain.runway;

import airport.domain.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
public interface RunwayCrackRepository extends JpaRepository<RunwayCrack, Long> {
}
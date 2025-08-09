package airport.domain.report;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RunwayCrackReportRepository
    extends JpaRepository<RunwayCrackReport, Long> {

        Optional<RunwayCrackReport> findByCrackId(Long crackId);
    }

package airport.domain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "workTrucks",
    path = "workTrucks"
)
public interface WorkTruckRepository
    extends PagingAndSortingRepository<WorkTruck, Long> {

    @Query("SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END FROM WorkTruck w WHERE w.workTruckType = :classId AND w.workStartTime <= CURRENT_TIMESTAMP AND w.workEndTime >= CURRENT_TIMESTAMP")
    boolean isWorkTimeMatched(@Param("classId") Integer classId);

}

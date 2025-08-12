package airport.domain.report;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "equipmentReports",
    path = "equipmentReports"
)
public interface EquipmentReportRepository
    extends PagingAndSortingRepository<EquipmentReport, Long> {}
// package airport.domain.report;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// @Repository // 이 인터페이스가 Repository 컴포넌트임을 명시합니다. (선택사항이지만 권장)
// public interface EquipmentReportRepository extends JpaRepository<EquipmentReport, Long> {
//     // JpaRepository를 상속받는 것만으로 기본적인 CRUD 메소드가 모두 제공됩니다.
//     // (findAll, findById, save, delete 등)
// }
package airport.domain;

import airport.domain.*;

import org.springframework.data.repository.PagingAndSortingRepository;

// PoEAA / Repository
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {
    // 필요한 커스텀 쿼리 메서드 추가 가능
}
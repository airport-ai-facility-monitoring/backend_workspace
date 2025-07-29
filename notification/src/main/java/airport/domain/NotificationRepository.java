package airport.domain;

import airport.domain.*;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

//<<< PoEAA / Repository
@RepositoryRestResource(
    collectionResourceRel = "notifications",
    path = "notifications"
)
public interface NotificationRepository
    extends PagingAndSortingRepository<Notification, Long> {

        // 목록 조회 with 검색, 정렬, 필터, 페이징
        // Page<Notification> findByTitleContainingOrContentsContaining(String title, String contents, Pageable pageable);

        // Page<Notification> findByWriterId(Long writerId, Pageable pageable);

        // Page<Notification> findByTitleContainingOrContentsContainingAndWriterId(
        //     String title, String contents, Long writerId, Pageable pageable
        // );
    }

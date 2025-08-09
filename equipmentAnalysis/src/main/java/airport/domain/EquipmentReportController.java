// package airport.domain;

// import airport.domain.*;
// import java.util.Optional;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;
// import javax.transaction.Transactional;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import java.util.*;

// //<<< Clean Arch / Inbound Adaptor

// @RestController
// @RequestMapping(value="/equipmentReports")
// @Transactional
// public class EquipmentReportController {

//     @Autowired
//     EquipmentReportRepository equipmentReportRepository;

//     // 전체 보고서 조회
//     @GetMapping
//     public List<EquipmentReport> getAllReports() {
//         List<EquipmentReport> result = new ArrayList<>();
//         equipmentReportRepository.findAll().forEach(result::add);
//         return result;
//     }

//     // 단일 보고서 조회
//     @GetMapping("/{id}")
//     public EquipmentReport getReportById(@PathVariable Long id) {
//         return equipmentReportRepository.findById(id)
//             .orElseThrow(() -> new RuntimeException("보고서를 찾을 수 없습니다"));
//     }

//     // 보고서 삭제
//     @DeleteMapping("/{id}")
//     public void deleteReport(@PathVariable Long id) {
//         equipmentReportRepository.deleteById(id);
//     }

//     // 장비 점검 완료
//     @PutMapping("/{id}/complete")
//     public void completeInspection(@PathVariable Long id) {
//         Optional<EquipmentReport> reportOptional = equipmentReportRepository.findById(id);
//         if (reportOptional.isPresent()) {
//             EquipmentReport report = reportOptional.get();
//             report.completeInspection(); // 상태 변경 및 이벤트 발행
//             equipmentReportRepository.save(report);
//         }
//     }
// }
// //>>> Clean Arch / Inbound Adaptor

package airport.domain.equipment; // 패키지 경로는 동일하게 맞추세요.
import airport.domain.EquipmentReport;
import airport.domain.EquipmentReportDto;
import airport.domain.EquipmentReportRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * EquipmentReport에 대한 API 요청을 처리하는 컨트롤러 클래스입니다.
 */
@RestController // 이 클래스가 REST API를 처리하는 컨트롤러임을 나타냅니다.
@RequestMapping("/equipmentReports") // 이 컨트롤러의 모든 API는 "/equipment-reports" 라는 경로로 시작합니다.
public class EquipmentReportController {

    // @Autowired는 스프링이 자동으로 해당 타입의 객체(Bean)를 주입해줍니다.
    @Autowired
    EquipmentReportRepository equipmentReportRepository; // 데이터베이스와 통신하기 위한 Repository

    /**
     * 모든 장비 보고서 목록을 조회하는 API 입니다.
     * 경로: GET /equipment-reports
     */
    @GetMapping
    public ResponseEntity<List<EquipmentReportDto>> getAllReports() {
        // 1. 데이터베이스에서 모든 EquipmentReport 엔티티 목록을 조회합니다.
        List<EquipmentReport> entities = equipmentReportRepository.findAll();

        // 2. 조회된 엔티티 목록을 DTO 목록으로 변환합니다. (Java Stream API 사용)
        //    각각의 엔티티(entity)를 new EquipmentReportDto(entity)를 통해 DTO로 만듭니다.
        List<EquipmentReportDto> dtos = entities.stream()
                                                .map(EquipmentReportDto::new)
                                                .collect(Collectors.toList());
        
        // 3. 변환된 DTO 목록을 성공 상태(200 OK)와 함께 응답합니다.
        return ResponseEntity.ok(dtos);
    }

    /**
     * 특정 ID의 장비 보고서를 조회하는 API 입니다.
     * 경로: GET /equipment-reports/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentReportDto> getReportById(@PathVariable Long id) {
        // 1. ID를 사용해 데이터베이스에서 특정 EquipmentReport 엔티티를 조회합니다.
        //    데이터가 없을 수도 있으므로 Optional로 감싸서 받습니다.
        return equipmentReportRepository.findById(id)
                .map(entity -> {
                    // 2. 데이터가 존재하면, 엔티티를 DTO로 변환합니다.
                    EquipmentReportDto dto = new EquipmentReportDto(entity);
                    // 3. 변환된 DTO를 성공 상태(200 OK)와 함께 응답합니다.
                    return ResponseEntity.ok(dto);
                })
                // 4. 데이터가 존재하지 않으면, '찾을 수 없음'(404 Not Found) 상태를 응답합니다.
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        // ID를 사용해 해당 데이터가 존재하는지 먼저 확인합니다.
        if (!equipmentReportRepository.existsById(id)) {
            // 데이터가 없으면 '찾을 수 없음'(404 Not Found) 상태를 응답합니다.
            return ResponseEntity.notFound().build();
        }

        // 데이터가 존재하면, 데이터베이스에서 삭제합니다.
        equipmentReportRepository.deleteById(id);

        // 성공적으로 삭제되었음을 의미하는 '내용 없음'(204 No Content) 상태를 응답합니다.
        // 클라이언트에게 "요청은 성공했고, 돌려줄 내용은 없어" 라는 의미입니다.
        return ResponseEntity.noContent().build();
    }
}
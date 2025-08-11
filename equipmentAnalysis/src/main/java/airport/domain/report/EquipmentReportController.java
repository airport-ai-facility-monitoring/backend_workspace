package airport.domain.report;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

import airport.domain.report.ai.MaintenanceService;
import airport.domain.report.dto.MaintenanceRequest;

/**
 * EquipmentReport에 대한 API 요청을 처리하는 컨트롤러 클래스입니다.
 */
@RestController // 이 클래스가 REST API를 처리하는 컨트롤러임을 나타냅니다.
@RequestMapping("/equipmentReports") // 이 컨트롤러의 모든 API는 "/equipment-reports" 라는 경로로 시작합니다.
public class EquipmentReportController {

    // @Autowired는 스프링이 자동으로 해당 타입의 객체(Bean)를 주입해줍니다.
    @Autowired
    EquipmentReportRepository equipmentReportRepository; // 데이터베이스와 통신하기 위한 Repository

    @Autowired
    MaintenanceService maintenanceService;


        /**
     * 장비 정보에 대한 유지보수 분석을 요청하는 API입니다.
     * HTTP POST 요청으로 장비 상세 정보(MaintenanceRequest)를 받아,
     * 서비스 계층에 분석 및 저장을 요청하고, 생성된 리포트를 반환합니다.
     *
     * @param request 클라이언트가 보낸 장비 상세 정보 DTO
     * @return 데이터베이스에 저장된 MaintenanceReport 객체
     * @throws JsonProcessingException Gemini API 응답 파싱 중 발생할 수 있는 예외
     */
    @PostMapping("/analyze")
    public ResponseEntity<EquipmentReport> analyze(@RequestBody MaintenanceRequest request) throws JsonProcessingException {
        EquipmentReport report = maintenanceService.analyzeAndSave(request);
        return ResponseEntity.ok(report);
    }
    /**
     * 모든 장비 보고서 목록을 조회하는 API 입니다.
     * 경로: GET /equipment-reports
     */
    // @GetMapping
    // public ResponseEntity<List<EquipmentReport>> getAllReports() {
    //     // 1. 데이터베이스에서 모든 EquipmentReport 엔티티 목록을 조회합니다.
    //     List<EquipmentReport> entities = equipmentReportRepository.findAll();

    //     // 3. 변환된 DTO 목록을 성공 상태(200 OK)와 함께 응답합니다.
    //     return ResponseEntity.ok(entities);
    // }

    /**
     * 특정 ID의 장비 보고서를 조회하는 API 입니다.
     * 경로: GET /equipment-reports/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentReport> getReportById(@PathVariable Long id) {
        // 1. ID를 사용해 데이터베이스에서 특정 EquipmentReport 엔티티를 조회합니다.
        //    데이터가 없을 수도 있으므로 Optional로 감싸서 받습니다.
        return equipmentReportRepository.findById(id)
                .map(entity -> {
                    // 2. 데이터가 존재하면, 엔티티를 DTO로 변환합니다.
                    // 3. 변환된 DTO를 성공 상태(200 OK)와 함께 응답합니다.
                    return ResponseEntity.ok(entity);
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
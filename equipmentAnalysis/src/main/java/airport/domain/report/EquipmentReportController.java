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
import airport.domain.report.dto.CommonMaintenanceRequest;
import airport.domain.report.dto.LightingDto;
import airport.domain.report.dto.SignDto;
import airport.domain.report.dto.WeatherDto;


/**
 * EquipmentReport에 대한 API 요청을 처리하는 컨트롤러 클래스입니다.
 */
@RestController
@RequestMapping(value="/equipmentReports")
public class EquipmentReportController {

    @Autowired
    EquipmentReportRepository equipmentReportRepository;

    @Autowired
    MaintenanceService maintenanceService;

    /**
     * 조명 장비 정보에 대한 유지보수 분석을 요청하는 API입니다.
     */
    @PostMapping("/regist/lighting")
    public ResponseEntity<EquipmentReport> analyzeLighting(@RequestBody LightingDto request) throws JsonProcessingException {
        System.out.println((CommonMaintenanceRequest)request);
        EquipmentReport report = maintenanceService.analyzeAndSave(request);
        return ResponseEntity.ok(report);
    }

    /**
     * 기상관측 장비 정보에 대한 유지보수 분석을 요청하는 API입니다.
     */
    @PostMapping("/regist/weather")
    public ResponseEntity<EquipmentReport> analyzeWeather(@RequestBody WeatherDto request) throws JsonProcessingException {
        System.out.println((CommonMaintenanceRequest)request);
        EquipmentReport report = maintenanceService.analyzeAndSave(request);
        return ResponseEntity.ok(report);
    }

    /**
     * 표시-표지 장비 정보에 대한 유지보수 분석을 요청하는 API입니다.
     */
    @PostMapping("/regist/sign")
    public ResponseEntity<EquipmentReport> analyzeSign(@RequestBody SignDto request) throws JsonProcessingException {
        System.out.println((CommonMaintenanceRequest)request);
        EquipmentReport report = maintenanceService.analyzeAndSave(request);
        return ResponseEntity.ok(report);
    }


    /**
     * 특정 ID의 장비 보고서를 조회하는 API 입니다.
     * 경로: GET /equipmentReports/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentReport> getReportById(@PathVariable Long id) {
        return equipmentReportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 특정 ID의 장비 보고서를 삭제하는 API 입니다.
     * 경로: DELETE /equipmentReports/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        if (!equipmentReportRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        equipmentReportRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

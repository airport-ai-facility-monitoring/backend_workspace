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

import org.springframework.web.bind.annotation.PutMapping;
import java.util.Map;


/**
 * EquipmentReport에 대한 API 요청을 처리하는 컨트롤러 클래스입니다.
 */
@RestController
@RequestMapping(value="/api/equipmentReports")
public class EquipmentReportController {

    @Autowired
    EquipmentReportRepository equipmentReportRepository;

    @Autowired
    MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<EquipmentReport>> getAllReports() {
        // 1. 데이터베이스에서 모든 EquipmentReport 엔티티 목록을 조회합니다.
        List<EquipmentReport> entities = equipmentReportRepository.findAll();

        // 3. 변환된 DTO 목록을 성공 상태(200 OK)와 함께 응답합니다.
        return ResponseEntity.ok(entities);
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

    // ✅ 저장 안하고 LLM 결과만 생성해서 돌려줌
    @PostMapping("/preview/lighting")
    public ResponseEntity<ReportPreviewResponse> previewLighting(@RequestBody LightingDto request) throws JsonProcessingException {
        return ResponseEntity.ok(maintenanceService.preview(request));
    }
    @PostMapping("/preview/weather")
    public ResponseEntity<ReportPreviewResponse> previewWeather(@RequestBody WeatherDto request) throws JsonProcessingException {
        return ResponseEntity.ok(maintenanceService.preview(request));
    }
    @PostMapping("/preview/sign")
    public ResponseEntity<ReportPreviewResponse> previewSign(@RequestBody SignDto request) throws JsonProcessingException {
        return ResponseEntity.ok(maintenanceService.preview(request));
    }

    // ✅ 저장(기존 regist) — 편집한 본문이 오면 그대로 저장
    @PostMapping("/regist/lighting")
    public ResponseEntity<EquipmentReport> analyzeLighting(@RequestBody LightingDto request) throws JsonProcessingException {
        return ResponseEntity.ok(maintenanceService.analyzeAndSave(request));
    }
    @PostMapping("/regist/weather")
    public ResponseEntity<EquipmentReport> analyzeWeather(@RequestBody WeatherDto request) throws JsonProcessingException {
        return ResponseEntity.ok(maintenanceService.analyzeAndSave(request));
    }
    @PostMapping("/regist/sign")
    public ResponseEntity<EquipmentReport> analyzeSign(@RequestBody SignDto request) throws JsonProcessingException {
        return ResponseEntity.ok(maintenanceService.analyzeAndSave(request));
    }

    // @PutMapping("/{id}") // JDK 17 이상
    // public ResponseEntity<EquipmentReport> updateReport(
    //         @PathVariable Long id,
    //         @RequestBody Map<String, Object> body) {

    //     EquipmentReport r = equipmentReportRepository.findById(id)
    //         .orElseThrow(() -> new RuntimeException("보고서를 찾을 수 없습니다."));

    //     // LLM 본문 갱신
    //     Object llm = body.getOrDefault("llm_report", body.get("llmReport"));
    //     if (llm instanceof String s) r.setLlmReport(s);

    //     // 선택 필드들 필요 시 함께 갱신 허용
    //     if (body.get("name") instanceof String s2) r.setName(s2);
    //     if (body.get("maintenanceCost") instanceof Number n) r.setMaintenanceCostNum(n.intValue());
    //     if (body.get("purchase") instanceof Number p) r.setPurchase(p.intValue());

    //     EquipmentReport saved = equipmentReportRepository.save(r);
    //     return ResponseEntity.ok(saved);
    // }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentReport> updateReport(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        EquipmentReport r = equipmentReportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("보고서를 찾을 수 없습니다."));

        // LLM 본문 갱신 (llm_report 또는 llmReport 둘 다 허용)
        Object llm = body.containsKey("llm_report") ? body.get("llm_report") : body.get("llmReport");
        if (llm != null && llm instanceof String) {
            r.setLlmReport((String) llm);
        }

        // 선택 필드 갱신
        Object nm = body.get("name");
        if (nm != null && nm instanceof String) {
            r.setName((String) nm);
        }

        Object mc = body.get("maintenanceCost");
        if (mc != null && mc instanceof Number) {
            r.setMaintenanceCostNum(((Number) mc).intValue());
        }

        Object pc = body.get("purchase");
        if (pc != null && pc instanceof Number) {
            r.setPurchase(((Number) pc).intValue());
        }

        EquipmentReport saved = equipmentReportRepository.save(r);
        return ResponseEntity.ok(saved);
    }
}

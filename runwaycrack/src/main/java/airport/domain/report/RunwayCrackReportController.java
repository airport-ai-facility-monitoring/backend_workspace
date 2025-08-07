package airport.domain.report;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;
import airport.domain.runway.RunwayCrack;
import airport.domain.runway.RunwayCrackRepository;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/runwaycrackreports")
@Transactional
public class RunwayCrackReportController {

    @Autowired
    RunwayCrackReportRepository runwayCrackReportRepository;
    
    @Autowired
    RunwayCrackRepository runwayCrackRepository;

    @Autowired
    AnalysisService analysisService;

    @GetMapping("/{id}")
    public ResponseEntity<RunwayCrackReportDto> getCrackReportById(@PathVariable Long id) {
        Optional<RunwayCrack> crackOpt = runwayCrackRepository.findById(id);
        if (crackOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        RunwayCrack crack = crackOpt.get();
        RunwayCrackReport report = crack.getReport(); // 연관된 보고서

        RunwayCrackReportDto dto = new RunwayCrackReportDto(
            crack.getImageUrl(),
            crack.getLength(),
            crack.getArea(),
            crack.getCctvId(),
            crack.getDetectedDate(),
            report != null ? report.getTitle() : null,
            report != null ? report.getCause() : null,
            report != null ? report.getReportContents() : null,
            report != null ? report.getRepairPeriod() : null,
            report != null ? report.getRepairCost() : null
        );

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/analyze/{id}")
    public ResponseEntity<RunwayCrack> analyze(@PathVariable Long id) throws JsonProcessingException {
        RunwayCrack updatedCrack = analysisService.analyzeAndSave(id);
        return ResponseEntity.ok(updatedCrack);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RunwayCrackReport> patchReport(
        @PathVariable Long id,
        @RequestBody Map<String, Object> updates) {

    return runwayCrackReportRepository.findById(id)
        .map(report -> {
            if (updates.containsKey("title")) {
                Object val = updates.get("title");
                if (val != null) report.setTitle(val.toString());
            }
            if (updates.containsKey("cause")) {
                Object val = updates.get("cause");
                if (val != null) report.setCause(val.toString());
            }
            if (updates.containsKey("reportContents")) {
                Object val = updates.get("reportContents");
                if (val != null) report.setReportContents(val.toString());
            }
            if (updates.containsKey("repairPeriod")) {
                Object val = updates.get("repairPeriod");
                if (val instanceof Number) {
                    report.setRepairPeriod(((Number) val).intValue());
                }
            }
            if (updates.containsKey("repairCost")) {
                Object val = updates.get("repairCost");
                if (val instanceof Number) {
                    report.setRepairCost(((Number) val).intValue());
                }
            }

            runwayCrackReportRepository.save(report);
            return ResponseEntity.ok(report);
        })
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
//>>> Clean Arch / Inbound Adaptor

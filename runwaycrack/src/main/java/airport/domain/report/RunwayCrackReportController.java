package airport.domain.report;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;
import airport.domain.report.ai.AnalyzeRequestDto;
import airport.domain.runway.RunwayCrack;
import airport.domain.runway.RunwayCrackRepository;
import lombok.Data;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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

    @GetMapping()
    public ResponseEntity<List<RunwayCrackReport>> getAllReports() {
        List<RunwayCrackReport> reports = runwayCrackReportRepository.findAll();
        if (reports.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<RunwayCrackReportDto> getCrackReportById(@PathVariable Long reportId) {
        Optional<RunwayCrackReport> reportOpt = runwayCrackReportRepository.findById(reportId);
        if (reportOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        RunwayCrackReport report = reportOpt.get();

        // 보고서에 연결된 crackId로 RunwayCrack 조회
        Optional<RunwayCrack> runwayCrackOpt = runwayCrackRepository.findById(report.getCrackId());
        if (runwayCrackOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        RunwayCrack runwayCrack = runwayCrackOpt.get();

        RunwayCrackReportDto dto = new RunwayCrackReportDto(
            runwayCrack.getImageUrl(),
            runwayCrack.getLength(),
            runwayCrack.getArea(),
            runwayCrack.getCctvId(),
            runwayCrack.getDetectedDate(),
            report.getTitle(),
            report.getDamageInfo(),
            report.getRepairMaterials(),
            report.getEstimatedCost(),
            report.getEstimatedPeriod(),
            report.getSummary(),
            report.getWritingDate()
        );
        dto.setEmployeeId(report.getEmployeeId());

        return ResponseEntity.ok(dto);
    }
    
    @PostMapping("/analyze/{id}")
    public ResponseEntity<RunwayCrackReport> analyze(@PathVariable Long id, @RequestBody AnalyzeRequestDto request, @RequestHeader("X-Employee-Id") String employeeId) throws JsonProcessingException {
        RunwayCrackReport updatedCrack = analysisService.analyzeAndSave(id, request, employeeId);
        return ResponseEntity.ok(updatedCrack);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchReport(
            @PathVariable Long id,
            @Valid @RequestBody RunwayCrackReportUpdateDto updateDto,
            BindingResult bindingResult,
            @RequestHeader("X-Employee-Id") String employeeId // 헤더에서 받음
    ) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }
        
        return runwayCrackReportRepository.findById(id)
            .map(report -> {
                // 권한 체크: 요청한 employeeId와 보고서 작성자가 일치하는지 확인
                if (!report.getEmployeeId().toString().equals(employeeId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }

                updateReportFields(report, updateDto);
                RunwayCrackReport updatedReport = runwayCrackReportRepository.save(report);
                return ResponseEntity.ok(updatedReport);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private void updateReportFields(RunwayCrackReport report, RunwayCrackReportUpdateDto updateDto) {
        Optional.ofNullable(updateDto.getCrackId()).ifPresent(report::setCrackId);
        Optional.ofNullable(updateDto.getTitle()).ifPresent(report::setTitle);
        Optional.ofNullable(updateDto.getDamageInfo()).ifPresent(report::setDamageInfo);
        Optional.ofNullable(updateDto.getRepairMaterials()).ifPresent(report::setRepairMaterials);
        Optional.ofNullable(updateDto.getEstimatedCost()).ifPresent(report::setEstimatedCost);
        Optional.ofNullable(updateDto.getEstimatedPeriod()).ifPresent(report::setEstimatedPeriod);
        Optional.ofNullable(updateDto.getSummary()).ifPresent(report::setSummary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(
        @PathVariable Long id,
        @RequestHeader("X-Employee-Id") String employeeId
    ) {
        return runwayCrackReportRepository.findById(id)
            .map(report -> {
                if (!report.getEmployeeId().toString().equals(employeeId)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
                runwayCrackReportRepository.delete(report);
                return ResponseEntity.noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

}
//>>> Clean Arch / Inbound Adaptor

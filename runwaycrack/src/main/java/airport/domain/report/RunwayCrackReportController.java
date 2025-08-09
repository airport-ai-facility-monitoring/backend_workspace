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

    // 6. 컨트롤러의 보고서 반환 API 수정 (간소화)
    @GetMapping("/{id}")
    public ResponseEntity<RunwayCrackReportDto> getCrackReportById(@PathVariable Long id) {
        Optional<RunwayCrackReport> crackReportOpt = runwayCrackReportRepository.findByCrackId(id);
        if (crackReportOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        RunwayCrackReport report = crackReportOpt.get();
        RunwayCrack runwayCrack = runwayCrackRepository.findById(id).get();
        System.out.println(report);
        System.out.println(runwayCrack);
        RunwayCrackReportDto dto = new RunwayCrackReportDto(
            runwayCrack.getImageUrl(),
            runwayCrack.getLength(),
            runwayCrack.getArea(),
            runwayCrack.getCctvId(),
            runwayCrack.getDetectedDate(),
            report.getTitle() ,
            report.getDamageInfo(),
            report.getRepairMaterials(),
            report.getEstimatedCost(),
            report.getEstimatedPeriod(),
            report.getSummary(),
            report.getWritingDate()
        );
        System.out.println(dto);
        return ResponseEntity.ok(dto);
    }
    @PostMapping("/analyze/{id}")
    public ResponseEntity<RunwayCrack> analyze(@PathVariable Long id, @RequestBody AnalyzeRequestDto request) throws JsonProcessingException {
        RunwayCrack updatedCrack = analysisService.analyzeAndSave(id, request);
        return ResponseEntity.ok(updatedCrack);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchReport(
            @PathVariable Long id,
            @Valid @RequestBody RunwayCrackReportUpdateDto updateDto,
            BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }
        
        return runwayCrackReportRepository.findById(id)
            .map(report -> {
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

}
//>>> Clean Arch / Inbound Adaptor

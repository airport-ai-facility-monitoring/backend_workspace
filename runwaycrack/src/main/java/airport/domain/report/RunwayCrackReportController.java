package airport.domain.report;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;
import airport.domain.report.ai.AnalyzeRequestDto;
import airport.domain.runway.RunwayCrack;
import airport.domain.runway.RunwayCrackRepository;
import lombok.Data;

import airport.domain.report.ai.PredictionClient;
import airport.domain.report.ai.PredictResponse;

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


import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;


//<<< Clean Arch / Inbound Adaptor
@Slf4j
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

    @Autowired PredictionClient predictionClient;

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
            runwayCrack.getLengthCm(),
            runwayCrack.getAreaCm2(),
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
        System.out.println("REQUEST 요청목록" + request);
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

    
    // @PostMapping("/predict/{id}")
    // public ResponseEntity<PredictResponse> predict(
    //         @PathVariable Long id,
    //         @RequestBody Map<String, Object> payload
    // ) {
    //     // 길이/면적 누락 시 DB 값으로 보충
    //     runwayCrackRepository.findById(id).ifPresent(rc -> {
    //         payload.putIfAbsent("crack_length_cm", rc.getLength());
    //         payload.putIfAbsent("crack_area_cm2", rc.getArea());
    //     });

    //     if (!payload.containsKey("crack_length_cm") || !payload.containsKey("crack_area_cm2")) {
    //         return ResponseEntity.badRequest().build();
    //     }

    //     PredictResponse res = predictionClient.predict(payload);
    //     return ResponseEntity.ok(res);
    // }


private final ObjectMapper om = new ObjectMapper();

    @PostMapping("/predict/{id}")
    public PredictResponse predictRepair(@PathVariable Long id, @RequestBody AnalyzeRequestDto dto) {
        try {
            // 1) 입력 로깅
            System.out.println("check");
            log.info("[PREDICT] id={}, rawRequest={}", id, om.writeValueAsString(dto));

            // 2) 기본 데이터 조회
            RunwayCrack rc = runwayCrackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RunwayCrack not found: id=" + id));
            Double rcLen  = rc.getLengthCm();
            Double rcArea = rc.getAreaCm2();
            log.info("[PREDICT] rc.lengthCm={}, rc.areaCm2={}", rcLen, rcArea);

            // 3) dto가 primitive(double)이므로 null 비교 대신 값 기준으로 사용 여부 결정
            //    dto가 0 이하이면 DB값 사용, DB도 null이면 400
            double lengthCm = (dto.getLengthCm() > 0) ? dto.getLengthCm() : (rcLen  != null ? rcLen  : 0.0);
            double areaCm2  = (dto.getAreaCm2()  > 0) ? dto.getAreaCm2()  : (rcArea != null ? rcArea : 0.0);

            if (lengthCm <= 0 || areaCm2 <= 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid length/area. lengthCm=" + lengthCm + ", areaCm2=" + areaCm2
                );
            }

            // 4) 파생값 계산
            double areaM2 = areaCm2 / 10000.0;
            double avgWidthCm = (areaM2 * 10000.0) / lengthCm;

            double repairFactor = (1.1 * dto.getSealingUsed())
                                + (1.4 * dto.getEpoxyUsed())
                                + (1.8 * dto.getRebarUsed());
            if (repairFactor == 0) repairFactor = 1.1;

            double repairAreaM2 = areaM2 * repairFactor;

            log.info("[PREDICT] computed lengthCm={}, areaCm2={}, areaM2={}, avgWidthCm={}, repairAreaM2={}, factor={}",
                    lengthCm, areaCm2, areaM2, avgWidthCm, repairAreaM2, repairFactor);

            // 5) 모델 서버 요청 DTO 구성 (snake_case)
            PredictRequest req = new PredictRequest();
            req.setLength_cm(lengthCm);
            req.setAvg_width_cm(avgWidthCm);
            req.setArea_m2(areaM2);
            req.setRepair_area_m2(repairAreaM2);
            req.setPavement_type_concrete(dto.getPavementTypeConcrete());
            req.setEpoxy_used(dto.getEpoxyUsed());
            req.setWiremesh_used(dto.getWiremeshUsed());
            req.setJoint_seal_used(dto.getJointSealUsed());
            req.setRebar_used(dto.getRebarUsed());
            req.setPolymer_used(dto.getPolymerUsed());
            req.setSealing_used(dto.getSealingUsed());

            log.info("[PREDICT] feignRequest={}", om.writeValueAsString(req));

            // 6) 호출 & 응답 로깅
            PredictResponse resp = predictionClient.predict(req);
            log.info("[PREDICT] feignResponse={}", om.writeValueAsString(resp));
            return resp;

        } catch (FeignException e) {
            // 모델 서버 오류/역직렬화 오류를 프론트에 그대로 전달
            log.error("[PREDICT] feign error status={}, body={}", e.status(), e.contentUTF8());
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Predict service error: " + e.contentUTF8(),
                e
            );
        } catch (ResponseStatusException e) {
            // 유효성 실패/리소스 없음 등은 그대로 전달
            log.warn("[PREDICT] 4xx: {}", e.getReason());
            throw e;
        } catch (Exception e) {
            // 기타 미처 처리 못한 예외
            log.error("[PREDICT] server error", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
        }
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

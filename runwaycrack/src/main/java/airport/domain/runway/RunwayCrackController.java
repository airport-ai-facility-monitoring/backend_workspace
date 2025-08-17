package airport.domain.runway;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;

import java.time.LocalDate;
import java.util.HashMap;
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

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/runwaycracks")
@Transactional
public class RunwayCrackController {

    @Autowired
    RunwayCrackRepository runwayCrackRepository;

    @Autowired
    AnalysisService analysisService;

    @GetMapping
    public List<RunwayCrack> getAllCracks() {
        return runwayCrackRepository.findAll();
    }
    //1. 탐지된 모델에서 값 받아올 api
    @PostMapping
    public ResponseEntity<Map<String, Object>> runwayCrackDetect(@RequestBody Map<String, Object> req) {
            try {
                RunwayCrack crack;
                Optional<RunwayCrack> existing = runwayCrackRepository.findByCctvId(
                        Long.valueOf(req.get("cctvId").toString())
                );

                if(existing.isPresent()) {
                    crack = existing.get();
                    
                    // 기존 면적이 새 면적보다 크면 업데이트
                    if(crack.getLengthCm() < Double.valueOf(req.get("lengthCm").toString())) {
                        crack.setLengthCm(Double.valueOf(req.get("lengthCm").toString()));
                        crack.setAreaCm2(Double.valueOf(req.get("areaCm2").toString()));
                        crack.setImageUrl((String) req.get("imageUrl"));
                        crack.setDetectedDate(LocalDate.now());
                        // 필요하면 reportState도 업데이트
                    }
                } else {
                    crack = new RunwayCrack();
                    crack.setCctvId(Long.valueOf(req.get("cctvId").toString()));
                    crack.setLengthCm(Double.valueOf(req.get("lengthCm").toString()));
                    crack.setAreaCm2(Double.valueOf(req.get("areaCm2").toString()));
                    crack.setImageUrl((String) req.get("imageUrl"));
                    crack.setReportState(false);
                    crack.setDetectedDate(LocalDate.now());
                }

                // DB 저장 (새로 생성 또는 업데이트)
                runwayCrackRepository.save(crack);


                Map<String, Object> response = new HashMap<>();
                response.put("message", "활주로 손상 정보가 성공적으로 저장되었습니다.");
                response.put("rcId", crack.getRcId());

                return ResponseEntity.ok(response);

            } catch (Exception e) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "요청 처리 중 오류 발생: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
        }


    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> report(@RequestBody Map<String, Object> req) {
        try {
            Long rcId = Long.valueOf(req.get("rcId").toString());
            var result = runwayCrackRepository.findById(rcId);
            if(result.isPresent()){
                ReportRequested reportRequested = new ReportRequested(result.get());
                reportRequested.publishAfterCommit();
                // 1. ai의 프롬프트 입력값 보내기
                // analysisService.analyzeAndSave(body);
                // 로직 처리
                Map<String, Object> res = new HashMap<>();
                res.put("message", "보고가 성공적으로 처리되었습니다.");
                res.put("rcId", rcId);
                return ResponseEntity.ok(res); // 200 OK
            }else{
                throw new RuntimeException("보고 요청 오류");
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "요청 처리 중 오류 발생");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); // 400 Bad Request
        }
    }
}
//>>> Clean Arch / Inbound Adaptor

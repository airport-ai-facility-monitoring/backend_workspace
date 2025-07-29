package airport.domain.runway;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;

import java.util.HashMap;
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
// @RequestMapping(value="/runwayCracks")
@Transactional
public class RunwayCrackController {

    @Autowired
    RunwayCrackRepository runwayCrackRepository;

    @Autowired
    AnalysisService analysisService;

    // 1. 탐지된 모델에서 값 받아올 api
    // @PostMapping("/runwaycrack")
    // public ResponseEntity<Map<String, Object>> runwayCrackDetect(@RequestBody Map<String, Object> req) {
       
    //     try {
            
    //     } catch (Exception e) {
    //         Map<String, Object> error = new HashMap<>();
    //         error.put("error", "요청 처리 중 오류 발생");
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); // 400 Bad Request
    //     }
    // }

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

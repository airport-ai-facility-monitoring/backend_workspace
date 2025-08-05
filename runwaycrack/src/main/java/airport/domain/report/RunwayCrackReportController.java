package airport.domain.report;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;

import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;

//<<< Clean Arch / Inbound Adaptor

@RestController
// @RequestMapping(value="/runwayCrackReports")
@Transactional
public class RunwayCrackReportController {

    @Autowired
    RunwayCrackReportRepository runwayCrackReportRepository;
    
    @Autowired
    AnalysisService analysisService;

    @PostMapping("/analyze/{id}")
    public ResponseEntity<Void> analyze(@RequestBody String body) throws JsonProcessingException {
        analysisService.analyzeAndSave(body);
        return ResponseEntity.ok().build();
    }
}
//>>> Clean Arch / Inbound Adaptor

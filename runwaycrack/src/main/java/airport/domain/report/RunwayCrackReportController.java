package airport.domain.report;

import airport.domain.*;
import airport.domain.report.ai.AnalysisService;
import airport.domain.runway.RunwayCrack;

import java.util.List;
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
    AnalysisService analysisService;

    @GetMapping("/{id}")
    public ResponseEntity<RunwayCrackReport> getCrackReportById(@PathVariable Long id) {
        Optional<RunwayCrackReport> reportOpt = runwayCrackReportRepository.findById(id);
        if (reportOpt.isPresent()) {
            return ResponseEntity.ok(reportOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/analyze/{id}")
    public ResponseEntity<Void> analyze(@PathVariable Long id) throws JsonProcessingException {
        analysisService.analyzeAndSave(id);
        return ResponseEntity.ok().build();
    }
}
//>>> Clean Arch / Inbound Adaptor

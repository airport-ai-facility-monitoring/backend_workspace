package airport.infra;

import airport.domain.*;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/equipmentReports")
@Transactional
public class EquipmentReportController {

    @Autowired
    EquipmentReportRepository equipmentReportRepository;

    // 전체 보고서 조회
    @GetMapping
    public List<EquipmentReport> getAllReports() {
        List<EquipmentReport> result = new ArrayList<>();
        equipmentReportRepository.findAll().forEach(result::add);
        return result;
    }

    // 단일 보고서 조회
    @GetMapping("/{id}")
    public EquipmentReport getReportById(@PathVariable Long id) {
        return equipmentReportRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("보고서를 찾을 수 없습니다"));
    }

    // 보고서 삭제
    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable Long id) {
        equipmentReportRepository.deleteById(id);
    }

    // 장비 점검 완료
    @PutMapping("/{id}/complete")
    public void completeInspection(@PathVariable Long id) {
        Optional<EquipmentReport> reportOptional = equipmentReportRepository.findById(id);
        if (reportOptional.isPresent()) {
            EquipmentReport report = reportOptional.get();
            report.completeInspection(); // 상태 변경 및 이벤트 발행
            equipmentReportRepository.save(report);
        }
    }
}
//>>> Clean Arch / Inbound Adaptor

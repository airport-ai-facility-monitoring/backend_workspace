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

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/equipments")
@Transactional
public class EquipmentController {

    @Autowired
    EquipmentRepository equipmentRepository;

    @PostMapping
    public Equipment registerEquipment(@RequestBody Equipment equipment) {
        return equipmentRepository.save(equipment);
    }
    // 분석 요청 API 추가
    @PostMapping("/{id}/analyze")
    public void requestAnalysis(@PathVariable Long id) {
        Equipment equipment = equipmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다"));

        equipment.requestAnalysis(); // 도메인 메서드 호출
        equipmentRepository.save(equipment); // 상태 변경 저장
    }
}
//>>> Clean Arch / Inbound Adaptor

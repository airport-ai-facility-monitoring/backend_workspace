package airport.predict;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import airport.domain.*;
import airport.dto.*;
import java.util.*;

import java.util.Map;

/**
 * 프론트에서 장비 ID만 보내면 DB값으로 payload 구성해서 FastAPI /predict 호출.
 * 필요 시 body로 일부 값을 override할 수 있음.
 */
@RestController
@RequestMapping("/api/equip")
@RequiredArgsConstructor
public class EquipmentPredictionController {

    private final EquipmentPredictionService predictionService;

    // 예: POST /equip/predict/123
    // body는 선택(없어도 됨). 있으면 해당 키만 DB값 위에 덮어씀.
    @PostMapping("/predict/{id}")
    public PredictClient.PredictResponse predict(@PathVariable Long id,
                                                 @RequestBody(required = false) OverrideRequest overrides) {
        Map<String, Object> payload = overrides == null ? null : overrides.getValues();
        return predictionService.predictForEquipment(id, payload);
    }

    @Data
    public static class OverrideRequest {
        // 자유형 키-값. 예: {"runtime": 5400, "failure": 3, "laborRate": 32000}
        private Map<String, Object> values;
    }
}

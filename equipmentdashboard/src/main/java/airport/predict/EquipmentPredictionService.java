package airport.predict;

import airport.domain.*;
import airport.domain.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import airport.dto.*;
import java.util.*;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EquipmentPredictionService {

    private final EquipmentRepository equipmentRepository;
    private final PredictClient predictClient;

    /**
     * 프론트에서 넘어온 override를 DB값 위에 덮어써서 /predict payload 생성
     */
    public PredictClient.PredictResponse predictForEquipment(Long equipmentId, Map<String, Object> overrides) {
        Equipment eq = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다: " + equipmentId));

        String type = nullSafe(eq.getEquipmentType()); // "기상"|"조명"|"표지-표시" 등
        int categoryCode = mapTypeToCategory(type);    // 1(weather)/2(lighting)/3(signage)

        Map<String, Object> payload = new HashMap<>();
        payload.put("category", categoryCode);

        // 공통(숫자 기대되는 컬럼은 숫자로 캐스팅 시도)
        putNum(payload, "purchase", eq.getPurchase());
        putNum(payload, "failure", eq.getFailure());
        putNum(payload, "runtime", eq.getRuntime());
        putNum(payload, "serviceYears", eq.getServiceYears());
        putNum(payload, "repairCost", eq.getRepairCost());
        putNum(payload, "repairTime", eq.getRepairTime());
        putNum(payload, "laborRate", eq.getLaborRate());
        putNum(payload, "avgLife", eq.getAvgLife());

        // 코드형(모델은 숫자 코드 기대) → DB가 문자열일 수도 있으니 숫자로 변환 시도
        putCode(payload, "manufacturer", eq.getManufacturer());
        putCode(payload, "protectionRating", eq.getProtectionRating());

        // 카테고리별 세부
        if (categoryCode == 1) { // weather
            WeatherEquipmentDetail w = eq.getWeatherDetail();
            if (w != null) {
                putCode(payload, "mountType", w.getMountType());
                putNum(payload, "powerConsumption", w.getPowerConsumption());
            }
        } else if (categoryCode == 2) { // lighting
            LightingEquipmentDetail l = eq.getLightingDetail();
            if (l != null) {
                putCode(payload, "lampType", l.getLampType());
                putNum(payload, "powerConsumption", l.getPowerConsumption());
            }
        } else if (categoryCode == 3) { // signage
            SignEquipmentDetail s = eq.getSignDetail();
            if (s != null) {
                // FastAPI는 installationType 사용. DB에는 mountType이므로 그대로 매핑
                putCode(payload, "installationType", s.getMountType());
                putCode(payload, "material", s.getMaterial());
                putCode(payload, "signColor", s.getSignColor());
                putNum(payload, "panelWidth", s.getPanelWidth());
                putNum(payload, "panelHeight", s.getPanelHeight());
            }
        }

        // 프론트에서 온 override가 있으면 덮어쓰기 (예: runtime, failure, laborRate 등)
        if (overrides != null) {
            for (Map.Entry<String, Object> e : overrides.entrySet()) {
                payload.put(e.getKey(), e.getValue());
            }
        }

        // FastAPI 호출
        return predictClient.predict(payload);
    }

    // ---- helpers ----
    private static String nullSafe(String s) { return s == null ? "" : s.trim(); }

    private static int mapTypeToCategory(String equipmentType) {
        // 필요에 따라 category 필드가 따로 있으면 그걸 사용해도 됨(eq.getCategory()).
        // 여기서는 장비유형 문자열을 간단 매핑.
        String t = equipmentType == null ? "" : equipmentType.trim();
        if (t.contains("기상")) return 1;
        if (t.contains("조명")) return 2;
        // "표지-표시", "표지", "사인" 등 모두 3으로
        return 3;
    }

    private static void putNum(Map<String, Object> m, String key, Object v) {
        if (v == null) return;
        try {
            if (v instanceof Number) {
                m.put(key, ((Number) v).doubleValue());
            } else {
                m.put(key, Double.valueOf(v.toString()));
            }
        } catch (Exception ignore) {
            // 숫자 변환 실패 시 넣지 않음(모델 쪽에서 NaN 허용)
        }
    }

    private static void putCode(Map<String, Object> m, String key, Object v) {
        if (v == null) return;
        try {
            if (v instanceof Number) {
                m.put(key, ((Number) v).intValue());
                return;
            }
            String s = v.toString().trim();
            // "1", "2" 같은 문자열이면 숫자로
            if (s.matches("\\d+")) {
                m.put(key, Integer.parseInt(s));
            } else {
                // 라벨 문자열이 들어오는 경우를 대비(가능하면 숫자 코드만 쓰는 걸 권장)
                // 여기서 라벨→코드 매핑 테이블을 적용하면 더 안전
                m.put(key, s);
            }
        } catch (Exception ignore) {}
    }
}

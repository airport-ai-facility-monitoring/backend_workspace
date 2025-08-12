package airport.predict;

import airport.domain.*;
import airport.domain.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EquipmentPredictionService {

    private final EquipmentRepository equipmentRepository;
    private final PredictClient predictClient;

    // ---------- 라벨 → 코드 매핑 테이블 ----------
    // 프로젝트에 맞게 자유롭게 보강하세요 (제조사/보호등급 등)
    private static final Map<String, Map<String, Integer>> CODEBOOK;
    static {
        Map<String, Integer> lampType = new HashMap<>();
        lampType.put("LED", 1);
        lampType.put("Halogen", 2);
        lampType.put("Fluorescent", 3);

        Map<String, Integer> mountType = new HashMap<>();
        mountType.put("pole", 1);
        mountType.put("mast", 2);
        mountType.put("surface", 3);
        mountType.put("tripod", 4);

        Map<String, Integer> material = new HashMap<>();
        material.put("Aluminum", 1);
        material.put("Stainless Steel", 2);
        material.put("Polycarbonate", 3);

        Map<String, Integer> signColor = new HashMap<>();
        signColor.put("White", 1);
        signColor.put("Yellow", 2);
        signColor.put("Black", 3);
        signColor.put("Red", 4);

        // 예시: 제조사/보호등급 (실제 값에 맞게 보강)
        Map<String, Integer> manufacturer = new HashMap<>();
        manufacturer.put("삼성", 1);
        manufacturer.put("LG", 2);

        Map<String, Integer> protectionRating = new HashMap<>();
        // 라벨 그대로 매핑되는 케이스
        protectionRating.put("IP65", 65);
        protectionRating.put("IP66", 66);
        protectionRating.put("IP67", 67);

        Map<String, Map<String, Integer>> tmp = new HashMap<>();
        tmp.put("lampType", lampType);
        tmp.put("mountType", mountType);         // weather에서 사용
        tmp.put("installationType", mountType);  // signage에서는 installationType 키로 보냄
        tmp.put("material", material);
        tmp.put("signColor", signColor);
        tmp.put("manufacturer", manufacturer);
        tmp.put("protectionRating", protectionRating);

        CODEBOOK = Collections.unmodifiableMap(tmp);
    }

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

        // 공통(숫자 기대)
        putNum(payload, "purchase", eq.getPurchase());
        putNum(payload, "failure", eq.getFailure());
        putNum(payload, "runtime", eq.getRuntime());
        putNum(payload, "serviceYears", eq.getServiceYears());
        putNum(payload, "repairCost", eq.getRepairCost());
        putNum(payload, "repairTime", eq.getRepairTime());
        putNum(payload, "laborRate", eq.getLaborRate());
        putNum(payload, "avgLife", eq.getAvgLife());

        // 코드형(숫자 코드 기대)
        putCode(payload, "manufacturer", eq.getManufacturer());
        putCode(payload, "protectionRating", eq.getProtectionRating());

        // 카테고리별
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

        // 프론트 override 덮어쓰기 (예: runtime, failure 등)
        if (overrides != null) {
            for (Map.Entry<String, Object> e : overrides.entrySet()) {
                // 프론트가 라벨을 보냈을 수도 있으니 키 타입에 따라 적절히 처리
                String k = e.getKey();
                Object v = e.getValue();
                if (isCodeKey(k)) {
                    putCode(payload, k, v);
                } else if (isNumericKey(k)) {
                    putNum(payload, k, v);
                } else {
                    payload.put(k, v);
                }
            }
        }

        // 디버깅: 최종 전송 페이로드 확인
        System.out.println("[Predict payload] " + payload);

        // FastAPI 호출
        return predictClient.predict(payload);
    }

    // ---- helpers ----
    private static String nullSafe(String s) { return s == null ? "" : s.trim(); }

    private static int mapTypeToCategory(String equipmentType) {
        String t = equipmentType == null ? "" : equipmentType.trim();
        if (t.contains("기상")) return 1;
        if (t.contains("조명")) return 2;
        // "표지-표시", "표시-표지", "표지", "사인"
        return 3;
    }

    private static boolean isNumericKey(String key) {
        // FastAPI FEATURE_COLUMNS 기준 숫자형 키 목록
        return Set.of(
                "purchase","failure","runtime","serviceYears",
                "repairCost","repairTime","laborRate","avgLife",
                "powerConsumption","panelWidth","panelHeight"
        ).contains(key);
    }

    private static boolean isCodeKey(String key) {
        // 숫자 코드로 보내야 하는 범주형 키 목록
        return Set.of(
                "manufacturer","protectionRating","lampType","mountType",
                "installationType","material","signColor"
        ).contains(key);
    }

    private static void putNum(Map<String, Object> m, String key, Object v) {
        if (v == null) return;
        try {
            if (v instanceof Number) {
                m.put(key, ((Number) v).doubleValue());
            } else {
                String s = v.toString().trim();
                if (s.isEmpty()) return;
                m.put(key, Double.valueOf(s));
            }
        } catch (Exception ignore) {
            // 숫자 변환 실패 시 넣지 않음(모델 측 NaN 허용)
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
            if (s.isEmpty()) return;

            // "123" 같은 문자열 숫자
            if (s.matches("\\d+")) {
                m.put(key, Integer.parseInt(s));
                return;
            }

            // 보호등급 "IP65" 같은 패턴 자동 파싱
            if ("protectionRating".equals(key)) {
                // IP65, ip66 등
                String up = s.toUpperCase(Locale.ROOT);
                if (up.startsWith("IP")) {
                    String digits = up.replaceAll("\\D+", "");
                    if (!digits.isEmpty()) {
                        m.put(key, Integer.parseInt(digits));
                        return;
                    }
                }
            }

            // 코드북 매핑 시도
            Map<String, Integer> dict = CODEBOOK.get(key);
            if (dict != null) {
                Integer mapped = dict.get(s);
                if (mapped != null) {
                    m.put(key, mapped);
                    return;
                }
            }

            // 매핑 실패 시: 스킵 (NaN 허용), 필요하면 기본값 주입 가능
            // m.put(key, 0);
        } catch (Exception ignore) {}
    }
}
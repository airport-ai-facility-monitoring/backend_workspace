package airport.domain.report.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import airport.domain.report.EquipmentReport;
import airport.domain.report.EquipmentReportRepository;
import airport.domain.report.dto.CommonMaintenanceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import airport.domain.report.ReportPreviewResponse;

import java.lang.reflect.Method;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final GeminiClient geminiClient;
    private final EquipmentReportRepository equipmentreportReposiory;
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /** ⬅️ 저장 없이 보고서 본문만 생성(미리보기) */
    public ReportPreviewResponse preview(CommonMaintenanceRequest request) throws JsonProcessingException {
        // 1) 의사결정 JSON
        String jsonResp = geminiClient.askGemini(MaintenancePromptFactory.buildPrompt(request));
        JsonNode node = parseGeminiJson(jsonResp);

        String action = getText(node, "maintenance_action");
        String disposition = getText(node, "disposition");
        Number totalCost = request.getMaintenance_cost();

        // 2) 보고서 본문
        String reportPrompt = MaintenancePromptFactory.buildReportPrompt(request, action, disposition, totalCost);
        String reportText = stripFence(geminiClient.askGemini(reportPrompt));

        ReportPreviewResponse res = new ReportPreviewResponse();
        res.setLlmReport(reportText);
        res.setMaintenanceCost(totalCost == null ? null : totalCost.doubleValue());
        res.setCategoryLabel(request.getCategory());
        //res.setRawJson(node.toString());
        return res;
    }

    /** 저장(등록) */
    public EquipmentReport analyzeAndSave(CommonMaintenanceRequest request) throws JsonProcessingException {

        // 1) 프리뷰 화면에서 편집한 본문(있으면 우선 사용)
        String finalReportText = request.getLlm_report();

        // 2) 요약 정보(action/decision/cost)를 만들기 위해 LLM JSON 호출(또는 필요시만)
        String jsonResp = geminiClient.askGemini(MaintenancePromptFactory.buildPrompt(request));
        JsonNode node = parseGeminiJson(jsonResp);
        String action = getText(node, "maintenance_action");
        String disposition = getText(node, "disposition");
        Number totalCostNum = request.getMaintenance_cost();

        // 3) 편집본이 없으면 본문 생성
        if (finalReportText == null || finalReportText.isBlank()) {
            String reportPrompt =
                MaintenancePromptFactory.buildReportPrompt(request, action, disposition, totalCostNum);
            finalReportText = stripFence(geminiClient.askGemini(reportPrompt));
        }

        // 4) 저장
        EquipmentReport report = new EquipmentReport();
        report.setAction(action);
        report.setDecision(disposition);
        report.setCost(totalCostNum == null ? null : String.valueOf(Math.round(totalCostNum.doubleValue())));
        report.setLlmReport(finalReportText);
        report.setRawJson(node.toString());

        // (선택) 메타 저장
        report.setEquipmentId(request.getEquipment_id());       // ✅ 추가
        report.setName(request.getName());                      // ✅ 추가
        report.setCategory(request.getCategory());              // 라벨/키 중 하나로 통일(프론트에서 그대로 표시)
        report.setSubCategory(request.getSub_category());       // ✅ 추가
        report.setManufacturer(request.getManufacturer());
        report.setPurchase(request.getPurchase());
        report.setProtectionRating(request.getProtection_rating());
        report.setFailure(request.getFailure());
        report.setRuntime(request.getRuntime());
        report.setServiceYears(request.getService_years());
        report.setMaintenanceCostNum(request.getMaintenance_cost());
        report.setRepairCost(request.getRepair_cost());
        report.setRepairTime(request.getRepair_time());
        report.setLaborRate(request.getLabor_rate());
        report.setAvgLife(request.getAvg_life());

        return equipmentreportReposiory.save(report);
    }

    // ---------- helpers ----------
    private static JsonNode parseGeminiJson(String json) throws JsonProcessingException {
        return MAPPER.readTree(stripFence(json == null ? "" : json));
    }

    private static String stripFence(String s) {
        if (s == null) return "";
        String t = s.trim();
        if (t.startsWith("```")) {
            t = t.substring(t.indexOf('\n') + 1);
            int i = t.lastIndexOf("```");
            if (i >= 0) t = t.substring(0, i);
        }
        return t.trim();
    }

    private static String getText(JsonNode node, String key) {
        try {
            JsonNode v = node.get(key);
            return (v == null || v.isNull()) ? "" : v.asText("");
        } catch (Exception e) { return ""; }
    }

    private static Number getNumber(JsonNode node, String key, Number fallback) {
        try {
            JsonNode v = node.get(key);
            if (v == null || v.isNull()) return fallback;
            if (v.isNumber()) return v.numberValue();
            String s = v.asText("").replaceAll("[^0-9\\.-]", "");
            return s.isBlank() ? fallback : Double.valueOf(s);
        } catch (Exception e) { return fallback; }
    }

    private static String toCostString(Number n) { return n == null ? null : String.valueOf(Math.round(n.doubleValue())); }
    private static String nz(String s) { return s == null ? "" : s; }

    /** 리플렉션으로 세터가 있는 경우만 안전하게 호출 */
    private static void setIf(Object target, String setter, Class<?> paramType, Object value) {
        try {
            Method m = target.getClass().getMethod(setter, paramType);
            m.invoke(target, value);
        } catch (NoSuchMethodException ignore) {
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

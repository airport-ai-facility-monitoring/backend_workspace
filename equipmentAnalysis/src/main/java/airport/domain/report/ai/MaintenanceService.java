// package airport.domain.report.ai;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import airport.domain.report.EquipmentReport;
// import airport.domain.report.EquipmentReportRepository;
// import airport.domain.report.dto.CommonMaintenanceRequest;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

/**
 * 유지보수 분석 관련 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * LLM(Gemini) API 호출, 응답 데이터 파싱, 데이터베이스 저장 등 핵심적인 역할을 수행합니다.
 */
// @Service
// @RequiredArgsConstructor
// public class MaintenanceService {

//     // Gemini API 통신을 위한 클라이언트 의존성 주입
//     private final GeminiClient geminiClient;
//     // 데이터베이스 작업을 위한 리포지토리 의존성 주입
//     private final EquipmentReportRepository equipmentreportReposiory;

//     /**
//      * 장비 정보를 받아 LLM을 통해 분석하고 그 결과를 데이터베이스에 저장합니다.
//      *
//      * @param request 클라이언트로부터 받은 장비 상세 정보
//      * @return 데이터베이스에 저장된 MaintenanceReport 객체
//      * @throws JsonProcessingException JSON 파싱 과정에서 발생할 수 있는 예외
//      */
//     public EquipmentReport analyzeAndSave(CommonMaintenanceRequest request) throws JsonProcessingException {
//         // 1. 프롬프트 생성: LLM에게 보낼 질문을 생성합니다.
//         String prompt = MaintenancePromptFactory.buildPrompt(request);

//         // 2. LLM API 호출: 생성된 프롬프트를 Gemini API로 보내고 응답(JSON 형식의 문자열)을 받습니다.
//         String jsonResponse = geminiClient.askGemini(prompt);
//         System.out.println("Gemini 응답 : " + jsonResponse);

//         // 3. 파싱 및 저장: LLM의 응답을 파싱하여 MaintenanceReport 객체로 변환하고 데이터베이스에 저장합니다.
//         return parseAndSave(jsonResponse);
//     }

//     /**
//      * LLM으로부터 받은 JSON 형식의 응답 문자열을 파싱하여 MaintenanceReport 객체로 변환하고,
//      * 데이터베이스에 저장한 뒤 그 객체를 반환합니다.
//      *
//      * @param json LLM이 반환한 JSON 형식의 문자열
//      * @return 데이터베이스에 저장된 MaintenanceReport 객체
//      * @throws JsonProcessingException JSON 파싱 과정에서 발생할 수 있는 예외
//      */
//     private EquipmentReport parseAndSave(String json) throws JsonProcessingException {
//         ObjectMapper mapper = new ObjectMapper();

//         // LLM 응답이 코드 블록(```)으로 감싸져 있을 경우, 순수 JSON 부분만 추출합니다.
//         if (json.startsWith("```")) {
//             json = json.substring(json.indexOf('\n') + 1, json.lastIndexOf("```")).trim();
//         }

//         // JSON 문자열을 JsonNode 객체로 파싱합니다.
//         JsonNode node = mapper.readTree(json);

//         // 파싱된 데이터로 MaintenanceReport 객체를 생성합니다.
//         EquipmentReport report = new EquipmentReport();
//         report.setAction(node.get("maintenance_action").asText());
//         report.setDecision(node.get("disposition").asText());
//         report.setCost(node.get("total_cost").asText());

//         // 완성된 리포트 객체를 데이터베이스에 저장하고 반환합니다.
//         return equipmentreportReposiory.save(report);
//     }
// }

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
        report.setCategory(request.getCategory());
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

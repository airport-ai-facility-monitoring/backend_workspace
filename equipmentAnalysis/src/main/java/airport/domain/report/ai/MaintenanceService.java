package airport.domain.report.ai;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import airport.domain.report.EquipmentReport;
import airport.domain.report.EquipmentReportRepository;
import airport.domain.report.dto.CommonMaintenanceRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


/**
 * 유지보수 분석 관련 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * LLM(Gemini) API 호출, 응답 데이터 파싱, 데이터베이스 저장 등 핵심적인 역할을 수행합니다.
 */
@Service
@RequiredArgsConstructor
public class MaintenanceService {

    // Gemini API 통신을 위한 클라이언트 의존성 주입
    private final GeminiClient geminiClient;
    // 데이터베이스 작업을 위한 리포지토리 의존성 주입
    private final EquipmentReportRepository equipmentreportReposiory;

    /**
     * 장비 정보를 받아 LLM을 통해 분석하고 그 결과를 데이터베이스에 저장합니다.
     *
     * @param request 클라이언트로부터 받은 장비 상세 정보
     * @return 데이터베이스에 저장된 MaintenanceReport 객체
     * @throws JsonProcessingException JSON 파싱 과정에서 발생할 수 있는 예외
     */
    public EquipmentReport analyzeAndSave(CommonMaintenanceRequest request) throws JsonProcessingException {
        // 1. 프롬프트 생성: LLM에게 보낼 질문을 생성합니다.
        String prompt = MaintenancePromptFactory.buildPrompt(request);

        // 2. LLM API 호출: 생성된 프롬프트를 Gemini API로 보내고 응답(JSON 형식의 문자열)을 받습니다.
        String jsonResponse = geminiClient.askGemini(prompt);
        System.out.println("Gemini 응답 : " + jsonResponse);

        // 3. 파싱 및 저장: LLM의 응답을 파싱하여 MaintenanceReport 객체로 변환하고 데이터베이스에 저장합니다.
        return parseAndSave(jsonResponse);
    }

    /**
     * LLM으로부터 받은 JSON 형식의 응답 문자열을 파싱하여 MaintenanceReport 객체로 변환하고,
     * 데이터베이스에 저장한 뒤 그 객체를 반환합니다.
     *
     * @param json LLM이 반환한 JSON 형식의 문자열
     * @return 데이터베이스에 저장된 MaintenanceReport 객체
     * @throws JsonProcessingException JSON 파싱 과정에서 발생할 수 있는 예외
     */
    private EquipmentReport parseAndSave(String json) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        // LLM 응답이 코드 블록(```)으로 감싸져 있을 경우, 순수 JSON 부분만 추출합니다.
        if (json.startsWith("```")) {
            json = json.substring(json.indexOf('\n') + 1, json.lastIndexOf("```")).trim();
        }

        // JSON 문자열을 JsonNode 객체로 파싱합니다.
        JsonNode node = mapper.readTree(json);

        // 파싱된 데이터로 MaintenanceReport 객체를 생성합니다.
        EquipmentReport report = new EquipmentReport();
        report.setAction(node.get("maintenance_action").asText());
        report.setDecision(node.get("disposition").asText());
        report.setCost(node.get("total_cost").asText());

        // 완성된 리포트 객체를 데이터베이스에 저장하고 반환합니다.
        return equipmentreportReposiory.save(report);
    }
}

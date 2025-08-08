package airport.domain.report.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import airport.domain.report.RunwayCrackReport;
import airport.domain.report.RunwayCrackReportRepository;
import airport.domain.runway.RunwayCrack;
import airport.domain.runway.RunwayCrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeminiClient geminiClient;
    private final RunwayCrackReportRepository runwayCrackReportRepository;
    private final RunwayCrackRepository runwayCrackRepository;

    public RunwayCrack analyzeAndSave(Long id) throws JsonProcessingException {
        RunwayCrack crack = runwayCrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 ID의 데이터가 없습니다."));
        if(crack.getReport() != null) return null; 
        String input = String.format(
            "손상 ID: %d\n" +
            "이미지 URL: %s\n" +
            "CCTV ID: %d\n" +
            "파손 길이: %d cm\n" +
            "파손 면적: %d cm²\n" +
            "손상 상세: %s\n" +
            "발견 날짜: %s",
            crack.getRcId(),
            crack.getImageUrl(),
            crack.getCctvId(),
            crack.getLength(),
            crack.getArea(),
            crack.getDamageDetails(),
            crack.getDetectedDate().toString()
        );

        String prompt =
            "다음 입력값을 바탕으로\n" +
            "1. title\n" +
            "2. crackType\n" +
            "3. possibleCause\n" +
            "4. damageSeverity\n" +
            "5. riskAssessment\n" +
            "6. repairDuration\n" +
            "7. repairCost\n" +
            "8. repairRecommendation\n" +
            "9. reportSummary\n" +
            "를 JSON 형태로 작성해주세요.\n" +
            "입력값:\n" + input;

        String json = geminiClient.askGemini(prompt);
        System.out.println("Gemini 응답 : " + json);

        RunwayCrackReport report = parseAndSave(json);
        report.setRunwayCrack(crack);
        report.setRcReportid(id);
        runwayCrackReportRepository.save(report);

        crack.setReport(report);
        crack.setReportState(true);
        runwayCrackRepository.save(crack);

        return crack;
    }

    private RunwayCrackReport parseAndSave(String json) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        if (json.startsWith("```")) {
            json = json.substring(json.indexOf('\n') + 1, json.lastIndexOf("```")).trim();
        }

        JsonNode node = mapper.readTree(json);

        RunwayCrackReport report = new RunwayCrackReport();
        report.setTitle(node.get("title").asText());
        report.setCrackType(node.get("crackType").asText());
        report.setCause(node.get("possibleCause").asText());
        report.setDamageSeverity(node.get("damageSeverity").asText());
        report.setRiskAssessment(node.get("riskAssessment").asText());
        report.setRepairPeriod(node.get("repairDuration").asInt());
        report.setRepairCost(node.get("repairCost").asInt());
        report.setRepairRecommendation(node.get("repairRecommendation").asText());
        report.setReportContents(node.get("reportSummary").asText());

        return report;
    }
}
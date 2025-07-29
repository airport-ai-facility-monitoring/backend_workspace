package airport.domain.report.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import airport.domain.report.RunwayCrackReport;
import airport.domain.report.RunwayCrackReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeminiClient geminiClient;
    private final RunwayCrackReportRepository runwayCrackReportRepository;

    public void analyzeAndSave(String input) throws JsonProcessingException {
        String prompt = 
            "다음 입력값을 바탕으로\n" +
            "1. 제목\n" +
            "2. 원인\n" +
            "3. 보고서내용\n" +
            "을 구분해서 JSON 형태로 응답해주세요.\n" +
            "배열로 안나누고 그냥 붙여서 문장 나열해주세요\n" +
            "입력값: " + input;

        String json = geminiClient.askGemini(prompt);
        System.out.println("Gemini 응답 : " + json);
        // JSON 파싱 → 각각 Report 엔티티에 저장
        RunwayCrackReport runwayCrackReport = parseAndSave(json);
        runwayCrackReportRepository.save(runwayCrackReport);
    }

    private RunwayCrackReport parseAndSave(String json) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        if (json.startsWith("```")) {
            json = json.substring(json.indexOf('\n') + 1, json.lastIndexOf("```")).trim();
        }

        JsonNode node = mapper.readTree(json);

        RunwayCrackReport runwayCrackReport = new RunwayCrackReport();
        runwayCrackReport.setTitle(node.get("제목").asText());
        runwayCrackReport.setCause(node.get("원인").asText());
        runwayCrackReport.setReportContents(node.get("보고서내용").asText());
        return runwayCrackReport;
    }
}
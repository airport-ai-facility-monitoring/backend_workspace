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

    public void analyzeAndSave(Long id) throws JsonProcessingException {
            RunwayCrack crack = runwayCrackRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("해당 ID의 데이터가 없습니다."));

        // input 문자열 생성: 예쁘게 포맷팅
        String input = String.format(
            "손상 ID: %d\n" +
            "이미지 URL: %s\n" +
            "CCTV ID: %d\n" +
            "손상 크기: %d\n" +
            "손상 상세: %s\n" +
            "발견 날짜: %s",
            crack.getRcId(),
            crack.getImageUrl(),
            crack.getCctvId(),
            crack.getSize(),
            crack.getDamageDetails(),
            crack.getDetectedDate().toString()
        );
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
        System.out.println("파싱성공");
        runwayCrackReport.setRcReportid(id);
        runwayCrackReportRepository.save(runwayCrackReport);
        System.out.println("저장성공");
        crack.setReportState(true);
        runwayCrackRepository.save(crack);
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
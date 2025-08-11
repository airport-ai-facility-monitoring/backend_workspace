package airport.domain.report.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import airport.domain.report.RunwayCrackReport;
import airport.domain.report.RunwayCrackReportRepository;
import airport.domain.runway.RunwayCrack;
import airport.domain.runway.RunwayCrackRepository;
import lombok.RequiredArgsConstructor;

import airport.domain.report.ai.AnalyzeRequestDto;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeminiClient geminiClient;
    private final RunwayCrackReportRepository runwayCrackReportRepository;
    private final RunwayCrackRepository runwayCrackRepository;

    public RunwayCrack analyzeAndSave(Long id, AnalyzeRequestDto request) throws JsonProcessingException {
        RunwayCrack crack = runwayCrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 ID의 데이터가 없습니다."));
        if (Boolean.TRUE.equals(crack.getReportState())) return null;

        String input = String.format(
            "【기본 손상 정보】\n" +
            "손상 ID: %d\n" +
            "CCTV ID: %d\n" +
            "파손 길이: %.1f cm\n" +
            "파손 면적: %.1f cm²\n" +
            "평균 폭: %.1f cm\n" +
            "보수 면적: %.2f m²\n" +
            "발견 날짜: %s\n" +
            "\n【수리 재료 및 공법】\n" +
            "콘크리트 포장재: %s\n" +
            "에폭시 사용: %s\n" +
            "와이어메시 사용: %s\n" +
            "줄눈 실링 사용: %s\n" +
            "철근 사용: %s\n" +
            "폴리머 사용: %s\n" +
            "실링 사용: %s\n" +
            "\n【AI 예측 결과】\n" +
            "예상 수리 비용: %,.0f원\n" +
            "예상 수리 기간: %.0f일",
            crack.getRcId(),
            crack.getCctvId(),
            crack.getLengthCm(),
            crack.getAreaCm2(),
            crack.getAvgWidthCm(),
            crack.getRepairAreaM2(),
            crack.getDetectedDate().toString(),
            request.getPavementTypeConcrete() == 1 ? "사용" : "미사용",
            request.getEpoxyUsed() == 1 ? "사용" : "미사용",
            request.getWiremeshUsed() == 1 ? "사용" : "미사용",
            request.getJointSealUsed() == 1 ? "사용" : "미사용",
            request.getRebarUsed() == 1 ? "사용" : "미사용",
            request.getPolymerUsed() == 1 ? "사용" : "미사용",
            request.getSealingUsed() == 1 ? "사용" : "미사용",
            request.getPredictedCost(),
            request.getPredictedDuration()
        );

        String prompt =
            "다음은 활주로 노면 손상 정보입니다. 제공된 데이터만을 기반으로 간단한 보고서를 JSON 형태로 작성해주세요.\n\n" +
            "【요청 항목】\n" +
            "1. title: 보고서 제목\n" +
            "2. damageInfo: 손상 기본 정보 (길이, 면적 포함)\n" +
            "3. repairMaterials: 선택된 수리 재료 목록\n" +
            "4. estimatedCost: 예상 비용 정보\n" +
            "5. estimatedPeriod: 예상 기간 정보\n" +
            "6. summary: 종합 의견\n\n" +
            "【작성 지침】\n" +
            "- 제공된 수치와 선택 사항만 사용\n" +
            "- 추측이나 가정 금지\n" +
            "- 간단명료하게 작성\n" +
            "- 각 항목은 2-3문장으로 제한\n" +
            "- JSON 구조는 중첩된 객체 없이 평탄하게 구성\n\n" +
            "입력 데이터:\n" + input;

        String json = geminiClient.askGemini(prompt);
        System.out.println("Gemini 응답 : " + json);

        RunwayCrackReport report = parseAndSave(json);
        report.setCrackId(id);
        report.setWritingDate(LocalDate.now());
        runwayCrackReportRepository.save(report);

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
        report.setDamageInfo(node.get("damageInfo").asText());
        report.setRepairMaterials(node.get("repairMaterials").asText());
        report.setEstimatedCost(node.get("estimatedCost").asText());
        report.setEstimatedPeriod(node.get("estimatedPeriod").asText());
        report.setSummary(node.get("summary").asText());

        return report;
    }
}
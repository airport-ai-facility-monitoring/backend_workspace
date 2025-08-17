package airport.domain.report.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import airport.domain.report.RunwayCrackReport;
import airport.domain.report.RunwayCrackReportRepository;
import airport.domain.runway.RunwayCrack;
import airport.domain.runway.RunwayCrackRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeminiClient geminiClient;
    private final RunwayCrackReportRepository runwayCrackReportRepository;
    private final RunwayCrackRepository runwayCrackRepository;

    public RunwayCrackReport analyzeAndSave(Long id, AnalyzeRequestDto request, String employeeId)
            throws JsonProcessingException {

        RunwayCrack crack = runwayCrackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 ID의 데이터가 없습니다."));
        if (Boolean.TRUE.equals(crack.getReportState())) return null;

        // ===== 심각도 규칙 기반 산정 (입력 전달용, DB 저장/판단은 아님) =====
        double L = crack.getLengthCm() != null ? crack.getLengthCm() : 0.0;   // cm
        double A = crack.getAreaCm2()  != null ? crack.getAreaCm2()  : 0.0;   // cm²

        String derivedSeverity;
        if (L >= 50 || A >= 300) {
            derivedSeverity = "긴급";
        } else if (L >= 20 || A >= 120) {
            derivedSeverity = "경고";
        } else if (L > 0 || A > 0) {
            derivedSeverity = "관찰";
        } else {
            derivedSeverity = "미분류";
        }

        // ===== LLM 입력 블록 =====
        String input = String.format(
                "【기본 손상 정보】\n" +
                "손상 ID: %d\n" +
                "CCTV ID: %d\n" +
                "심각도: %s\n" +
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
                derivedSeverity,
                L,
                A,
                crack.getAvgWidthCm() == null ? 0.0 : crack.getAvgWidthCm(),
                crack.getRepairAreaM2() == null ? 0.0 : crack.getRepairAreaM2(),
                crack.getDetectedDate() == null ? LocalDate.now().toString() : crack.getDetectedDate().toString(),
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

        // ===== 고도화 프롬프트 (UI 섹션 톤/형식 정렬, JSON만 반환) =====
        String prompt =
            "당신은 공항 시설관리팀 내부 결재용 보고서를 작성하는 어시스턴트입니다. " +
            "아래 입력 데이터에 기반하여, UI 섹션(메타→KPI→이미지→손상 상세→조치 계획→종합 의견)에 맞는 내용을 " +
            "한국어 공식 문체로 간결하게 작성하세요. 반드시 JSON만 반환합니다.\n\n" +

            "【출력 스키마(평탄 구조, 키 고정)】\n" +
            "{\n" +
            "  \"title\": string,\n" +
            "  \"damageInfo\": string,\n" +
            "  \"repairMaterials\": string,\n" +
            "  \"estimatedCost\": string,\n" +
            "  \"estimatedPeriod\": string,\n" +
            "  \"summary\": string\n" +
            "}\n\n" +

            "【작성 지침】\n" +
            "1) 입력 데이터에 존재하는 값만 사용하고, 값이 없으면 '미정' 또는 '분석 중'으로 표기합니다.\n" +
            "2) 수치 단위를 유지합니다: 길이 cm, 면적 cm², 비용 원, 기간 일.\n" +
            "3) '심각도'는 입력에 주어진 값을 그대로 기술하며 추정·격상·격하는 금지합니다.\n" +
            "4) 문체: 보고서/결재용 공식 문체. 과장·추측·가정 금지, 근거 없는 원인 단정 금지.\n" +
            "5) 마크다운/코드펜스/불릿/번호목록/주석 금지. **오직 JSON 본문만** 반환합니다.\n\n" +

            "【각 필드 분량 가이드】\n" +
            "- damageInfo: 2~3문장. 길이/면적/심각도 중심으로 사실만 요약.\n" +
            "- repairMaterials: 1~2문장. '사용'으로 표기된 재료/공법만 간결히 설명.\n" +
            "- estimatedCost / estimatedPeriod: '예상 비용: ~원', '예상 기간: ~일' 형식 고정.\n" +
            "- summary: **6~10문장, 총 700~900자 내외**. 아래 7개 하위 내용을 **문장으로** 모두 포함:\n" +
            "  (1) 안전 영향 평가(FOD 발생 가능성, 활주로 운영 영향 유무)\n" +
            "  (2) 운영 상 권고(관측 주기, 관제/운영 통보 필요 여부)\n" +
            "  (3) 임시 조치(표지/차단, 속도 제한, 관측 강화), **권고 시점(예: 즉시/24시간 이내)**\n" +
            "  (4) 영구 조치 절차(절삭, 충전, 줄눈 재시공 등)와 **작업 순서의 큰 틀**\n" +
            "  (5) 품질·안전 확인 항목(균열 재발 관측, 표면 평활도, 실링 상태 등)\n" +
            "  (6) 우선순위 등급(상/중/하)과 **착수 권고 일정(예: 야간 창구 작업)**\n" +
            "  (7) 재관측/추적 기준(예: 길이/면적 증가율, 관측 주기, 재평가 트리거 조건)\n\n" +

            "【표현 가이드 예】\n" +
            "- summary는 하나의 단락 또는 2~3단락으로 서술하되, 불릿·번호를 쓰지 말고 문장으로 기술합니다.\n" +
            "- 근거는 입력 데이터 범위 안에서만 언급합니다(예: \"면적이 300cm² 미만이므로 FOD 위험은 낮은 편\")\n\n" +

            "【입력 데이터】\n" + input + "\n\n" +

            "【반환 형식 예시】\n" +
            "{\n" +
            "  \"title\": \"활주로 파손 조사 보고서 - 관찰\",\n" +
            "  \"damageInfo\": \"길이 15.2cm, 면적 2.6cm² 규모의 손상이 확인되었습니다. 심각도는 관찰입니다.\",\n" +
            "  \"repairMaterials\": \"폴리머 충전 보수를 권장합니다.\",\n" +
            "  \"estimatedCost\": \"예상 비용: 134,480원\",\n" +
            "  \"estimatedPeriod\": \"예상 기간: 2일\",\n" +
            "  \"summary\": \"본 손상은 면적이 소규모로 분류되어 FOD 발생 가능성은 낮으나, 반복 사용 시 균열 확대 가능성은 존재합니다. 운항 안전에 미치는 직접적 영향은 제한적이나, 관측 주기를 단축하여 상태 변화를 추적할 필요가 있습니다. 임시 조치로 해당 구간 표시와 현장 점검 빈도 강화를 권고하며, 변화 징후(길이·면적 증가)가 확인될 경우 24시간 이내 재평가하십시오. 영구 조치는 손상부 절삭 후 폴리머 충전 및 필요 시 줄눈 보강을 권장하며, 건조 및 양생 시간을 준수해 표면 평활도를 확보해야 합니다. 품질 확인은 충전재 접착 상태, 방수·방오 성능, 주행 흔적 여부를 중심으로 체크합니다. 우선순위는 중이며, 야간 비혼잡 시간대 착수를 권합니다. 재관측 기준은 길이·면적이 20% 이상 증가하거나 표면 박리 징후가 발견될 때로 설정하고, 초기 2주간은 주 2회 관측 후 변동 추세에 따라 주 1회로 전환하십시오.\"\n" +
            "}\n\n" +
            "※ 위 예시는 길이와 형식 안내용이며, 반드시 실제 입력 값만 반영하세요.";

        String json = geminiClient.askGemini(prompt);
        System.out.println("Gemini 응답 : " + json);

        RunwayCrackReport report = parseAndSave(json);
        report.setCrackId(id);
        report.setWritingDate(LocalDate.now());
        report.setEmployeeId(Long.valueOf(employeeId));
        runwayCrackReportRepository.save(report);

        crack.setReportState(true);
        runwayCrackRepository.save(crack);

        return report;
    }

    private RunwayCrackReport parseAndSave(String json) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();

        // 모델이 ```json 코드펜스를 붙여오는 경우 제거
        if (json.startsWith("```")) {
            json = json.substring(json.indexOf('\n') + 1, json.lastIndexOf("```")).trim();
        }

        JsonNode node = mapper.readTree(json);

        RunwayCrackReport report = new RunwayCrackReport();
        report.setTitle(safeText(node, "title", "활주로 파손 조사 보고서"));
        report.setDamageInfo(safeText(node, "damageInfo", "분석 중"));
        report.setRepairMaterials(safeText(node, "repairMaterials", "미정"));
        report.setEstimatedCost(safeText(node, "estimatedCost", "미정"));
        report.setEstimatedPeriod(safeText(node, "estimatedPeriod", "미정"));
        report.setSummary(safeText(node, "summary", "해당 사항 없음"));

        return report;
    }

    private String safeText(JsonNode node, String key, String defVal) {
        if (node == null) return defVal;
        JsonNode v = node.get(key);
        if (v == null || v.isNull()) return defVal;
        String s = v.asText();
        return (s == null || s.isBlank()) ? defVal : s;
    }
}
package airport.domain.report.ai;

import airport.domain.report.dto.CommonMaintenanceRequest;
import airport.domain.report.dto.LightingDto;
import airport.domain.report.dto.SignDto;
import airport.domain.report.dto.WeatherDto;

public class MaintenancePromptFactory {

    /** (기존) JSON 3키(maintenance_action, disposition, total_cost) 응답용 프롬프트 */
    public static String buildPrompt(CommonMaintenanceRequest req) {
        StringBuilder input = new StringBuilder();
        input.append(String.format(
            "- 분류: %s\n" +
            "- 제조사: %s\n" +
            "- 구매 금액: %s원\n" +
            "- 구매일: %s\n" +
            "- 고장 기록: %s건\n" +
            "- 보호 등급: %s\n" +
            "- 월 평균 가동 시간: %s시간\n" +
            "- 내용 연수: %s년\n" +
            "- 예측 유지보수 비용: %s원\n" +
            "- 수리 비용: %s원\n" +
            "- 수리 시간: %s시간\n" +
            "- 시간당 인건비: %s원\n" +
            "- 평균 수명: %s년\n",
            n(req.getCategory()),
            n(req.getManufacturer()),
            n(req.getPurchase()),
            n(req.getPurchase_date()),
            // n(req.getPurchaseDate()).
            n(req.getFailure()),
            n(req.getProtection_rating()),
            // n(req.getProtectionRating()).
            n(req.getRuntime()),
            n(req.getService_years()),
            n(req.getMaintenance_cost()),
            n(req.getRepair_cost()),
            n(req.getRepair_time()),
            n(req.getLabor_rate()),
            n(req.getAvg_life())
            // n(req.getServiceYears()),
            // n(req.getMaintenanceCost()),
            // n(req.getRepairCost()),
            // n(req.getRepairTime()),
            // n(req.getLaborRate()),
            // n(req.getAvgLife())
        ));

        // 카테고리별 추가
        if (req instanceof LightingDto) {
            LightingDto l = (LightingDto) req;
            input.append(String.format(
                "- 램프 유형: %s\n- 소비 전력: %sW\n",
                n(l.getLamp_type()), n(l.getPower_consumption())
            ));
        } else if ( req instanceof WeatherDto) {
            WeatherDto w = (WeatherDto) req;
            input.append(String.format(
                "- 소비 전력: %sW\n- 설치 형태: %s\n",
                n(w.getPower_consumption()), n(w.getMount_type())
            ));
        } else if (req instanceof SignDto) {
            SignDto s = (SignDto) req;
            input.append(String.format(
                "- 패널 너비: %smm\n- 패널 높이: %smm\n- 재질: %s\n- 표지판 색상: %s\n- 설치 형태: %s\n",
                n(s.getPanel_width()), n(s.getPanel_height()), n(s.getMaterial()),
                n(s.getSign_color()), n(s.getMount_type())
            ));
        }

        String prompt =
            "다음 입력값을 바탕으로 JSON 형식으로만 답변해주세요.\n" +
            "- JSON에는 다음 세 가지 키만 포함합니다.\n" +
            "  1. maintenance_action : 문자열, 예상 유지보수 조치명과 설명을 한 줄에 작성\n" +
            "  2. disposition : 문자열, '유지', '폐기', '교체' 중 하나와 그 이유를 한 줄에 작성\n" +
            "  3. total_cost : 숫자, 조치에 필요한 총 비용(원)\n" +
            "- 다른 키나 부가 정보는 포함하지 마세요. 중첩 없이 평탄 JSON.\n\n" +
            "입력값:\n" + input;

        return prompt;
    }

    /** (신규) 완성 보고서 본문을 생성하기 위한 프롬프트 */
    public static String buildReportPrompt(CommonMaintenanceRequest req, String action, String disposition, Number totalCost) {
        StringBuilder sb = new StringBuilder();
        sb.append("당신은 공항 시설관리팀의 기술문서 담당자입니다. ")
          .append("아래 정보를 바탕으로 한국어 유지보수 보고서를 작성하세요.\n")
          .append("요구사항:\n")
          .append("1) 제목: '<분류> 장비 유지보수 보고서'\n")
          .append("2) 섹션 구성(순서 고정):\n")
          .append("   - 1) 개요(장비/환경/현황 요약: 3~4줄)\n")
          .append("   - 2) 비용 요약(예측 유지보수 비용, 최근 수리비, 인건비 가정)\n")
          .append("   - 3) 운영 지표(KPI: 월평균 가동시간, 연간 가동시간=월×12, MTBF, 연간 예상고장횟수)\n")
          .append("   - 4) 리스크 및 대응(환경/노후/보호등급 관점의 리스크와 대응)\n")
          .append("   - 5) 권고 및 유사 장비 제안(조치안/유지·교체 결정/유사장비 2~3개: 제조사·모델·예상가격·추천이유·장단점)\n")
          .append("   - 6) 정비 계획(주기/점검 항목/필수 예비부품 수량 가이드)\n")
          .append("   - 7) 산정 근거 데이터(입력/모델 산출값 요약)\n")
          .append("3) 형식: 마크다운/표/코드블록 없이 문단과 불릿 혼합. 너무 길게 쓰지 말 것.\n")
          .append("4) 숫자 표기: 천단위 콤마, 금액 뒤에 '원' 표기. 알 수 없으면 '정보 없음'.\n")
          .append("5) 톤: 과장 금지, 중립적·간결, 실행가능한 문장으로.\n")
          .append("6) 장비명은 첫 문단에 반드시 포함.\n\n");

        sb.append("입력값 요약:\n");
        sb.append(String.format(
            "- 분류: %s\n" +
            "- 제조사: %s\n" +
            "- 구매 금액: %s원\n" +
            "- 고장 기록: %s건\n" +
            "- 보호 등급: %s\n" +
            "- 월 평균 가동 시간: %s시간\n" +
            "- 내용 연수: %s년\n" +
            "- 예측 유지보수 비용: %s원\n" +
            "- 수리 비용: %s원\n" +
            "- 수리 시간: %s시간\n" +
            "- 시간당 인건비: %s원\n" +
            "- 평균 수명: %s년\n",
            n(req.getCategory()),
            n(req.getManufacturer()),
            n(req.getPurchase()),
            n(req.getFailure()),
            n(req.getProtection_rating()),
            // n(req.getProtectionRating()),
            n(req.getRuntime()),
            n(req.getService_years()),
            // n(req.getServiceYears()),
            n(totalCost == null ? req.getMaintenance_cost() : totalCost),
            // n(totalCost == null ? req.getMaintenanceCost() : totalCost),
            n(req.getRepair_cost()),
            n(req.getRepair_time()),
            n(req.getLabor_rate()),
            n(req.getAvg_life())
            // n(req.getRepairCost()),
            // n(req.getRepairTime()),
            // n(req.getLaborRate()),
            // n(req.getAvgLife())
        ));

        // 카테고리별 추가
        if (req instanceof LightingDto) {
            LightingDto l = (LightingDto) req;
            sb.append(String.format("- 램프 유형: %s\n- 소비 전력: %sW\n",
                    n(l.getLamp_type()), n(l.getPower_consumption())));
        } else if (req instanceof WeatherDto) {
            WeatherDto w = (WeatherDto) req;
            sb.append(String.format("- 소비 전력: %sW\n- 설치 형태: %s\n",
                    n(w.getPower_consumption()), n(w.getMount_type())));
        } else if (req instanceof SignDto) {
            SignDto s = (SignDto) req;
            sb.append(String.format(
                "- 패널 너비: %smm\n- 패널 높이: %smm\n- 재질: %s\n- 표지판 색상: %s\n- 설치 형태: %s\n",
                n(s.getPanel_width()), n(s.getPanel_height()), n(s.getMaterial()),
                n(s.getSign_color()), n(s.getMount_type())
            ));
        }

        sb.append("\n의사결정(모델 결과) 참고:\n");
        sb.append(String.format("- 예상 조치: %s\n- 유지/폐기/교체 결정: %s\n- 총 비용(원): %s\n",
                s(action), s(disposition), n(totalCost == null ? req.getMaintenance_cost() : totalCost)));

        sb.append(
          "\n추가 지시:\n" +
          "- 유사 장비 제안은 2~3개로, 제조사/모델/예상가격/추천이유/장단점을 1~2문장씩 간결히.\n" +
          "- 표가 아닌 불릿으로 나열. 과도한 브랜드 마케팅 문구 금지.\n" +
          "- KPI 계산 시:\n" +
          "  · 연간 가동시간 = 월평균 가동시간 × 12\n" +
          "  · MTBF(시간) = 평균 수명(시간)으로 간주 가능\n" +
          "  · 연간 예상 고장 횟수 ≈ 연간 가동시간 / MTBF (값이 없으면 '정보 없음')\n"
        );

        sb.append("\n이 지시를 충족하는 간결하고 일관된 보고서를 작성하세요.");
        return sb.toString();
    }

    private static String n(Object v) { return v == null ? "N/A" : String.valueOf(v); }
    private static String s(String v) { return v == null ? "" : v; }
}

// package airport.domain.report.ai;

// import airport.domain.report.dto.*;
// import java.util.Map;
// import java.util.stream.Collectors;
// import java.util.stream.Stream;

// /**
//  * LLM(Gemini)에게 전달할 프롬프트(지시사항)를 생성하는 클래스입니다.
//  * 정적 메서드를 사용하여, 입력된 장비 정보(MaintenanceRequest)를 바탕으로
//  * 구체적이고 체계적인 프롬프트 문자열을 동적으로 생성합니다.
//  */
// public class MaintenancePromptFactory {

//     public static String buildPrompt(CommonMaintenanceRequest req) {
//     // 1. 공통 정보 문자열 구성
//     StringBuilder input = new StringBuilder();
//     input.append(String.format(
//         "- 분류: %s\n" +
//         "- 제조사: %s\n" +
//         "- 구매 금액: %d원\n" +
//         "- 구매일: %s\n" +
//         "- 고장 기록: %d건\n" +
//         "- 보호 등급: %s\n" +
//         "- 월 평균 가동 시간: %d시간\n" +
//         "- 내용 연수: %d년\n" +
//         "- 예측 유지보수 비용: %d원\n" +
//         "- 수리 비용: %d원\n" +
//         "- 수리 시간: %d시간\n" +
//         "- 시간당 인건비: %d원\n" +
//         "- 평균 수명: %d년\n",
//         req.getCategory(),
//         req.getManufacturer(),
//         req.getPurchase(),
//         req.getPurchase_date(),
//         req.getFailure(),
//         req.getProtection_rating(),
//         req.getRuntime(),
//         req.getService_years(),
//         req.getMaintenance_cost(),
//         req.getRepair_cost(),
//         req.getRepair_time(),
//         req.getLabor_rate(),
//         req.getAvg_life()
//     ));
//     System.out.println("제조사" + req.getManufacturer());

//     // 2. 장비 유형별 전용 필드 추가
//     if (req instanceof LightingDto) {
//         LightingDto light = (LightingDto) req;
//         input.append(String.format(
//             "- 램프 유형: %s\n" +
//             "- 소비 전력: %sW\n",
//             light.getLamp_type(),
//             light.getPower_consumption() != null ? light.getPower_consumption() : "N/A"
//         ));
//     } else if (req instanceof WeatherDto) {
//         WeatherDto weather = (WeatherDto) req;
//         input.append(String.format(
//             "- 소비 전력: %sW\n" +
//             "- 설치 형태: %s\n",
//             weather.getPower_consumption() != null ? weather.getPower_consumption() : "N/A",
//             weather.getMount_type()
//         ));
//     } else if (req instanceof SignDto) {
//         SignDto sign = (SignDto) req;
//         input.append(String.format(
//             "- 패널 너비: %smm\n" +
//             "- 패널 높이: %smm\n" +
//             "- 재질: %s\n" +
//             "- 표지판 색상: %s\n" +
//             "- 설치 형태: %s\n",
//             sign.getPanel_width() != null ? sign.getPanel_width() : "N/A",
//             sign.getPanel_height() != null ? sign.getPanel_height() : "N/A",
//             sign.getMaterial(),
//             sign.getSign_color(),
//             sign.getMount_type()
//         ));
//     }

//     // 3. 최종 프롬프트 구성
//     String prompt =
//         "다음 입력값을 바탕으로 JSON 형식으로만 답변해주세요.\n" +
//         "- JSON에는 다음 세 가지 키만 포함합니다.\n" +
//         "  1. maintenance_action : 문자열, 예상 유지보수 조치명과 설명을 한 줄에 작성\n" +
//         "  2. disposition : 문자열, '유지', '폐기', '교체' 중 하나와 그 이유를 한 줄에 작성\n" +
//         "  3. total_cost : 숫자, 조치에 필요한 총 비용(원)만 작성\n" +
//         "- 다른 키나 부가 정보, 부품/인건비 상세 항목은 포함하지 마세요.\n" +
//         "- JSON은 중첩 객체 없이 평탄하게 작성하세요.\n\n" +
//         "입력값:\n" + input;

//     return prompt;
//     }

// }

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
        sb.append("다음 장비 정보를 바탕으로 한국어 보고서를 작성해줘.\n")
          .append("요구사항:\n")
          .append("1) 제목: '<분류> 장비 유지보수 보고서'\n")
          .append("2) 섹션: 기본정보 요약 → 예측 유지보수 비용 → 권고 조치/결정 및 근거 → 결론\n")
          .append("3) 숫자는 천단위 콤마, '원' 단위를 사용. 마크다운/표 없이 순수 텍스트.\n\n");

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

        sb.append("\n의사결정 요약(참고):\n");
        sb.append(String.format("- 예상 조치: %s\n- 유지/폐기 결정: %s\n",
                s(action), s(disposition)));

        sb.append("\n이 정보를 바탕으로 간결하고 일관된 문체로 보고서를 작성해줘.");
        return sb.toString();
    }

    private static String n(Object v) { return v == null ? "N/A" : String.valueOf(v); }
    private static String s(String v) { return v == null ? "" : v; }
}

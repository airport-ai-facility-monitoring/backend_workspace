// package airport.domain.report.ai;

// import airport.domain.report.dto.MaintenanceRequest;

// /**
//  * LLM(Gemini)에게 전달할 프롬프트(지시사항)를 생성하는 클래스입니다.
//  * 정적 메서드를 사용하여, 입력된 장비 정보(MaintenanceRequest)를 바탕으로
//  * 구체적이고 체계적인 프롬프트 문자열을 동적으로 생성합니다.
//  */
// public class MaintenancePromptFactory {

//     /**
//      * MaintenanceRequest 객체에 담긴 장비 정보를 바탕으로 LLM에게 보낼 프롬프트를 생성합니다.
//      *
//      * @param req 분석할 장비의 상세 정보가 담긴 DTO 객체
//      * @return LLM이 분석을 수행할 수 있도록 가공된 전체 프롬프트 문자열
//      */
//     public static String buildPrompt(MaintenanceRequest req) {
//         // 장비 기본 정보 문자열 구성
//         String input = String.format(
//             "- 분류: %s\n" +
//             "- 제조사: %s\n" +
//             "- 구매 금액: %d원\n" +
//             "- 구매일: %s\n" +
//             "- 고장 기록: %d건\n" +
//             "- 보호 등급: %s\n" +
//             "- 월 평균 가동 시간: %d시간\n" +
//             "- 내용 연수: %d년\n" +
//             "- 예측 유지보수 비용: %d원\n" +
//             "- 수리 비용: %d원\n" +
//             "- 수리 시간: %d시간\n" +
//             "- 시간당 인건비: %d원\n" +
//             "- 평균 수명: %d년\n",
//             req.getCategory(),
//             req.getManufacturer(),
//             req.getPurchase(),
//             req.getPurchase_date(),
//             req.getFailure(),
//             req.getProtection_rating(),
//             req.getRuntime(),
//             req.getService_years(),
//             req.getMaintenance_cost(),
//             req.getRepair_cost(),
//             req.getRepair_time(),
//             req.getLabor_rate(),
//             req.getAvg_life()
//         );

//         // 카테고리별 세부 정보 추가
//         String categoryDetail = "";
//         switch (req.getCategory()) {
//             case "조명":
//                 categoryDetail = String.format(
//                     "- 램프 유형: %s\n" +
//                     "- 소비 전력: %dW\n",
//                     req.getLamp_type(),
//                     req.getPower_consumption()
//                 );
//                 break;
//             case "기상관측장비":
//                 categoryDetail = String.format(
//                     "- 설치 형태: %s\n",
//                     req.getMount_type()
//                 );
//                 break;
//             case "표지판":
//                 categoryDetail = String.format(
//                     "- 패널 크기: %d x %d mm\n" +
//                     "- 재질: %s\n" +
//                     "- 색상: %s\n",
//                     req.getPanel_width(),
//                     req.getPanel_height(),
//                     req.getMaterial(),
//                     req.getSign_color()
//                 );
//                 break;
//         }

//         String prompt =
//             "다음 입력값을 바탕으로 JSON 형식으로만 답변해주세요.\n" +
//             "- JSON에는 다음 세 가지 키만 포함합니다.\n" +
//             "  1. maintenance_action : 문자열, 예상 유지보수 조치명과 설명을 한 줄에 작성\n" +
//             "  2. disposition : 문자열, '유지', '폐기', '교체' 중 하나와 그 이유를 한 줄에 작성\n" +
//             "  3. total_cost : 숫자, 조치에 필요한 총 비용(원)만 작성\n" +
//             "- 다른 키나 부가 정보, 부품/인건비 상세 항목은 포함하지 마세요.\n" +
//             "- JSON은 중첩 객체 없이 평탄하게 작성하세요.\n\n" +
//             "입력값:\n" + input + categoryDetail;

//         return prompt;
//     }
// }
package airport.domain.report.ai;

import airport.domain.report.dto.MaintenanceRequest;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * LLM(Gemini)에게 전달할 프롬프트(지시사항)를 생성하는 클래스입니다.
 * 정적 메서드를 사용하여, 입력된 장비 정보(MaintenanceRequest)를 바탕으로
 * 구체적이고 체계적인 프롬프트 문자열을 동적으로 생성합니다.
 */
public class MaintenancePromptFactory {

    // 소분류 카테고리를 대분류로 매핑하는 맵
    private static final Map<String, String> subToMainCategoryMap = Stream.of(new String[][] {
        { "REL", "조명" }, { "RCL", "조명" }, { "TDZL", "조명" }, { "REIL", "조명" },
        { "Anemometer", "기상관측" }, { "Windvane", "기상관측" }, { "Visibilitysensor", "기상관측" }, { "RVRsensor", "기상관측" },
        { "RDRS", "표시-표지" }, { "TEL", "표시-표지" }, { "TS", "표시-표지" }
    }).collect(Collectors.toMap(data -> data[0], data -> data[1]));


    /**
     * MaintenanceRequest 객체에 담긴 장비 정보를 바탕으로 LLM에게 보낼 프롬프트를 생성합니다.
     *
     * @param req 분석할 장비의 상세 정보가 담긴 DTO 객체
     * @return LLM이 분석을 수행할 수 있도록 가공된 전체 프롬프트 문자열
     */
    public static String buildPrompt(MaintenanceRequest req) {
        // 장비 기본 정보 문자열 구성
        String input = String.format(
            "- 분류: %s\n" +
            "- 제조사: %s\n" +
            "- 구매 금액: %d원\n" +
            "- 구매일: %s\n" +
            "- 고장 기록: %d건\n" +
            "- 보호 등급: %s\n" +
            "- 월 평균 가동 시간: %d시간\n" +
            "- 내용 연수: %d년\n" +
            "- 예측 유지보수 비용: %d원\n" +
            "- 수리 비용: %d원\n" +
            "- 수리 시간: %d시간\n" +
            "- 시간당 인건비: %d원\n" +
            "- 평균 수명: %d년\n",
            req.getCategory(),
            req.getManufacturer(),
            req.getPurchase(),
            req.getPurchase_date(),
            req.getFailure(),
            req.getProtection_rating(),
            req.getRuntime(),
            req.getService_years(),
            req.getMaintenance_cost(),
            req.getRepair_cost(),
            req.getRepair_time(),
            req.getLabor_rate(),
            req.getAvg_life()
        );

        // 소분류 카테고리(예: "REL")를 대분류(예: "조명")로 변환
        String mainCategory = subToMainCategoryMap.getOrDefault(req.getCategory(), "");

        // 카테고리별 세부 정보 추가
        String categoryDetail = "";
        switch (mainCategory) {
            case "조명":
                categoryDetail = String.format(
                    "- 램프 유형: %s\n" +
                    "- 소비 전력: %dW\n",
                    req.getLamp_type(),
                    req.getPower_consumption()
                );
                break;
            case "기상관측":
                categoryDetail = String.format(
                    "- 설치 형태: %s\n" +
                    "- 소비 전력: %dW\n",
                    req.getMount_type(),
                    req.getPower_consumption()
                );
                break;
            case "표시-표지":
                categoryDetail = String.format(
                    "- 패널 크기: %d x %d mm\n" +
                    "- 재질: %s\n" +
                    "- 색상: %s\n" +
                    "- 설치 형태: %s\n",
                    req.getPanel_width(),
                    req.getPanel_height(),
                    req.getMaterial(),
                    req.getSign_color(),
                    req.getMount_type()
                );
                break;
        }

        String prompt =
            "다음 입력값을 바탕으로 JSON 형식으로만 답변해주세요.\n" +
            "- JSON에는 다음 세 가지 키만 포함합니다.\n" +
            "  1. maintenance_action : 문자열, 예상 유지보수 조치명과 설명을 한 줄에 작성\n" +
            "  2. disposition : 문자열, '유지', '폐기', '교체' 중 하나와 그 이유를 한 줄에 작성\n" +
            "  3. total_cost : 숫자, 조치에 필요한 총 비용(원)만 작성\n" +
            "- 다른 키나 부가 정보, 부품/인건비 상세 항목은 포함하지 마세요.\n" +
            "- JSON은 중첩 객체 없이 평탄하게 작성하세요.\n\n" +
            "입력값:\n" + input + categoryDetail;

        return prompt;
    }
}
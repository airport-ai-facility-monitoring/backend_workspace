package airport.domain.report.ai;

import airport.domain.report.dto.*;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * LLM(Gemini)에게 전달할 프롬프트(지시사항)를 생성하는 클래스입니다.
 * 정적 메서드를 사용하여, 입력된 장비 정보(MaintenanceRequest)를 바탕으로
 * 구체적이고 체계적인 프롬프트 문자열을 동적으로 생성합니다.
 */
public class MaintenancePromptFactory {

    public static String buildPrompt(CommonMaintenanceRequest req) {
    // 1. 공통 정보 문자열 구성
    StringBuilder input = new StringBuilder();
    input.append(String.format(
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
    ));
    System.out.println("제조사" + req.getManufacturer());

    // 2. 장비 유형별 전용 필드 추가
    if (req instanceof LightingDto) {
        LightingDto light = (LightingDto) req;
        input.append(String.format(
            "- 램프 유형: %s\n" +
            "- 소비 전력: %sW\n",
            light.getLamp_type(),
            light.getPower_consumption() != null ? light.getPower_consumption() : "N/A"
        ));
    } else if (req instanceof WeatherDto) {
        WeatherDto weather = (WeatherDto) req;
        input.append(String.format(
            "- 소비 전력: %sW\n" +
            "- 설치 형태: %s\n",
            weather.getPower_consumption() != null ? weather.getPower_consumption() : "N/A",
            weather.getMount_type()
        ));
    } else if (req instanceof SignDto) {
        SignDto sign = (SignDto) req;
        input.append(String.format(
            "- 패널 너비: %smm\n" +
            "- 패널 높이: %smm\n" +
            "- 재질: %s\n" +
            "- 표지판 색상: %s\n" +
            "- 설치 형태: %s\n",
            sign.getPanel_width() != null ? sign.getPanel_width() : "N/A",
            sign.getPanel_height() != null ? sign.getPanel_height() : "N/A",
            sign.getMaterial(),
            sign.getSign_color(),
            sign.getMount_type()
        ));
    }

    // 3. 최종 프롬프트 구성
    String prompt =
        "다음 입력값을 바탕으로 JSON 형식으로만 답변해주세요.\n" +
        "- JSON에는 다음 세 가지 키만 포함합니다.\n" +
        "  1. maintenance_action : 문자열, 예상 유지보수 조치명과 설명을 한 줄에 작성\n" +
        "  2. disposition : 문자열, '유지', '폐기', '교체' 중 하나와 그 이유를 한 줄에 작성\n" +
        "  3. total_cost : 숫자, 조치에 필요한 총 비용(원)만 작성\n" +
        "- 다른 키나 부가 정보, 부품/인건비 상세 항목은 포함하지 마세요.\n" +
        "- JSON은 중첩 객체 없이 평탄하게 작성하세요.\n\n" +
        "입력값:\n" + input;

    return prompt;
}
}
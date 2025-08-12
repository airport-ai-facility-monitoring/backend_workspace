package airport.domain.report.ai;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Google Gemini API와의 통신을 담당하는 클라이언트 클래스입니다.
 * API 키를 사용하여 인증하고, 프롬프트를 전송하여 LLM의 응답을 받아오는 역할을 합니다.
 */
@Component
@RequiredArgsConstructor
public class GeminiClient {

    // application.yml 파일에 설정된 Gemini API 키를 주입받습니다.
    @Value("${gemini.api.key}")
    private String apiKey;

    /**
     * 입력된 프롬프트를 Gemini API로 전송하고, 모델이 생성한 텍스트 응답을 반환합니다.
     *
     * @param prompt LLM에게 전달할 질문 또는 지시사항
     * @return LLM이 생성한 텍스트 응답
     */
    public String askGemini(String prompt) {
        try {
            // Gemini SDK 클라이언트를 빌더 패턴을 사용하여 생성합니다.
            // API 키를 설정하여 인증합니다.
            Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();

            // 특정 모델(gemini-1.5-flash)에 프롬프트를 전달하여 콘텐츠 생성을 요청합니다.
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash", // 사용할 모델 지정 (예: gemini-1.5-pro, gemini-1.5-flash)
                    prompt,
                    null
            );

            // API 응답에서 텍스트 부분만 추출하여 반환합니다.
            return response.text();
        } catch (Exception e) {
            // API 호출 중 예외가 발생하면 콘솔에 스택 트레이스를 출력하고, 에러 메시지를 반환합니다.
            e.printStackTrace();
            return "에러: " + e.getMessage();
        }
    }
}

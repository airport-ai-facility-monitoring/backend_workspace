package airport.domain.report.ai;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GeminiClient {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String askGemini(String prompt) {
        try {
            // Gemini SDK 클라이언트 생성
            Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();

            // 요청 보내기
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash", // 또는 gemini-1.5-ro, gemini-2.5-flash
                    prompt,
                    null
            );

            return response.text();
        } catch (Exception e) {
            e.printStackTrace();
            return "에러: " + e.getMessage();
        }
    }
}
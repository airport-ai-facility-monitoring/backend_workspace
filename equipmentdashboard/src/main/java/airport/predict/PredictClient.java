package airport.predict;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class PredictClient {

    private final WebClient webClient;
    private final String functionKey;

    public PredictClient(@Value("${FUNCTION_KEY}") String functionKey) {
        this.functionKey = functionKey;
        this.webClient = WebClient.builder()
                .baseUrl("https://airportcopy27-h6d3g9g8e6aah6f3.koreacentral-01.azurewebsites.net")
                .build();
    }

    public PredictResponse predict(Map<String, Object> payload) {
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/EquipCost1")   // 기존 함수 이름 그대로
                        .queryParam("code", functionKey)  // 401 방지: 쿼리 파라미터로 Key 전달
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(PredictResponse.class)
                .onErrorResume(e -> Mono.error(new RuntimeException("Predict API 호출 실패: " + e.getMessage(), e)))
                .block();
    }

    // ------------ 응답 DTO ------------
    @Data
    public static class PredictResponse {
        private String category;                  // "weather" | "lighting" | "signage"
        private Double predictedMaintenanceCost;
        private String currency;                  // "KRW"
        private String modelVersion;
        private Long servedAt;
        private Map<String, Object> featuresUsed; // FastAPI에서 echo된 실제 입력
    }
}
package airport.predict;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

import airport.domain.*;
import airport.dto.*;
import java.util.*;

@Component
public class PredictClient {

    private final WebClient webClient;
    private final String functionKey;

    public PredictClient( @Value("${FUNCTION_KEY}") String functionKey) {
        this.functionKey = functionKey;
        this.webClient = WebClient.builder()
            .baseUrl("https://airportreport-esbngpcxa9e3cxaz.koreacentral-01.azurewebsites.net/api/EquipCost1")
            .build();
    }

    public PredictResponse predict(Map<String, Object> payload) {
        return webClient.post()
                .uri("") // baseUrl에 이미 EquipCost1 포함
                .header("x-functions-key", functionKey) // Function Key 헤더
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

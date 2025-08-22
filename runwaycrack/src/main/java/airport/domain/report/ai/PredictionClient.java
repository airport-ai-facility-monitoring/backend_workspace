// package airport.domain.report.ai;

// import lombok.RequiredArgsConstructor;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.stereotype.Component;
// import org.springframework.web.client.RestTemplate;

// import java.util.Map;

// @Component
// @RequiredArgsConstructor
// public class PredictionClient {
//     private final RestTemplate restTemplate;

//     @Value("${model.url}")
//     private String modelBase;

//     public PredictResponse predict(Map<String,Object> snakePayload){
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         HttpEntity<Map<String,Object>> entity = new HttpEntity<>(snakePayload, headers);

//         ResponseEntity<PredictResponse> res = restTemplate.exchange(
//             modelBase + "/predict",
//             HttpMethod.POST,
//             entity,
//             PredictResponse.class
//         );
//         return res.getBody();
//     }
// }

package airport.domain.report.ai;

import airport.domain.report.ai.PredictResponse; // 추가
import airport.domain.report.PredictRequest; 

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "runwaycrack",
             url = "https://costpredict-e6fgdxaydhfmgcht.koreacentral-01.azurewebsites.net")
public interface PredictionClient {

    @PostMapping("/api/CrackCost1?code=${FUNCTION_KEY}")
    PredictResponse predict(@RequestBody PredictRequest request);
}
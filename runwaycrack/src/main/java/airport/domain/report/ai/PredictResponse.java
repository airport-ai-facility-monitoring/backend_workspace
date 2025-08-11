// package airport.domain.report.ai;

// import lombok.Data;

// @Data
// public class PredictResponse {
//     private Integer predictedCost;
//     private Integer predictedDuration;
//     private String modelCostVersion;
//     private String modelDurationVersion;
// }
package airport.domain.report.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // 예비용: 추가 필드가 와도 무시
public class PredictResponse {

    @JsonProperty("cost")
    private Double predictedCost;       // float 대응

    @JsonProperty("duration")
    private Double predictedDuration;   // float 대응

    // 필요하면 버전 필드는 제거하거나, FastAPI에서 내려줄 때만 추가
    // private String modelCostVersion;
    // private String modelDurationVersion;
}
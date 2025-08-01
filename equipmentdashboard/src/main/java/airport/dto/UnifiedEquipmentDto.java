package airport.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // null인 필드는 JSON에서 제외
public class UnifiedEquipmentDto {

    // 공통 정보
    private EquipmentDto equipment;

    // 상세 정보 (각 Detail 클래스)
    // 이 중 하나만 값을 가지게 됩니다.
    private WeatherEquipmentDetailDto weatherDetail;
    private SignEquipmentDetailDto signDetail;
    private LightingEquipmentDetailDto lightingDetail;

}
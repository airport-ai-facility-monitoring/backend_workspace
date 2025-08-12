package airport.domain.report;

import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RunwayCrackReportUpdateDto {
    private Long crackId;
    
    @Size(max = 255, message = "제목은 255자를 초과할 수 없습니다")
    private String title;
    
    @Size(max = 500, message = "손상 정보는 500자를 초과할 수 없습니다")
    private String damageInfo;
    
    @Size(max = 500, message = "수리 자료는 500자를 초과할 수 없습니다")
    private String repairMaterials;
    
    @Size(max = 500, message = "예상 비용은 500자를 초과할 수 없습니다")
    private String estimatedCost;
    
    @Size(max = 500, message = "예상 기간은 500자를 초과할 수 없습니다")
    private String estimatedPeriod;
    
    @Size(max = 1000, message = "요약은 1000자를 초과할 수 없습니다")
    private String summary;
}
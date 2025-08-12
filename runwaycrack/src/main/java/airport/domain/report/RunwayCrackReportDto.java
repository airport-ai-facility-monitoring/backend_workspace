package airport.domain.report;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class RunwayCrackReportDto {
    private String imageUrl;
    private Double length;
    private Double area;
    private Long cctvId;
    private LocalDate detectedDate;

    private String title;
    private String damageInfo;
    private String repairMaterials;
    private String estimatedCost;     // Integer -> String
    private String estimatedPeriod;   // Integer -> String
    private LocalDate WritingDate;

    private String summary; // 위치는 상관없지만 선언은 위로 올려두는 걸 권장
        public Long employeeId;
    public String maskEmployeeId;

    public RunwayCrackReportDto(
        String imageUrl, Double length, Double area, Long cctvId, LocalDate detectedDate,
        String title, String damageInfo, String repairMaterials, String estimatedCost, String estimatedPeriod,
        String summary, LocalDate writingDate
    ) {

        this.imageUrl = imageUrl;
        this.length = length;
        this.area = area;
        this.cctvId = cctvId;
        this.detectedDate = detectedDate;
        this.title = title;
        this.damageInfo = damageInfo;
        this.repairMaterials = repairMaterials;
        this.estimatedCost = estimatedCost;
        this.estimatedPeriod = estimatedPeriod;
        this.summary = summary;
        this.WritingDate = writingDate;
    }

    

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
        // employeeId가 Long이면, 마스킹은 String형으로 변환하거나 별도 처리 필요
        // 예를 들어 Long -> String 변환 후 마스킹 처리
        if (employeeId != null) {
            this.maskEmployeeId = maskingEmployeeId(employeeId.toString());
        } else {
            this.maskEmployeeId = null;
        }
    }

    public static String maskingEmployeeId(String employeeId) {
        if (employeeId == null || employeeId.isEmpty()) return null;
        int len = employeeId.length();
        if (len <= 4) {
            return "*".repeat(len);
        } else {
            return "****" + employeeId.substring(4);
        }
    }


}

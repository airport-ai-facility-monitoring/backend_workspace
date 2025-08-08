package airport.domain.report;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RunwayCrackReportDto {
    private String imageUrl;
    private Integer length;
    private Integer area;
    private Long cctvId;
    private LocalDate detectedDate;

    private String title;
    private String cause;
    private String reportContents;
    private Integer repairPeriod;
    private Integer repairCost;

    public RunwayCrackReportDto(
        String imageUrl,
        Integer length,
        Integer area,
        Long cctvId,
        LocalDate detectedDate,
        String title,
        String cause,
        String reportContents,
        Integer repairPeriod,
        Integer repairCost
    ) {
        this.imageUrl = imageUrl;
        this.length = length;
        this.area = area;
        this.cctvId = cctvId;
        this.detectedDate = detectedDate;
        this.title = title;
        this.cause = cause;
        this.reportContents = reportContents;
        this.repairPeriod = repairPeriod;
        this.repairCost = repairCost;
    }
}
package airport.domain.report.ai;


import lombok.Data;

@Data
public class AnalyzeRequestDto {
    // 모델 입력값 11개
    private double lengthCm;
    private double areaCm2;
    private double areaM2;
    private double repairAreaM2;
    private int pavementTypeConcrete;
    private int epoxyUsed;
    private int wiremeshUsed;
    private int jointSealUsed;
    private int rebarUsed;
    private int polymerUsed;
    private int sealingUsed;

    // 예측 결과값 2개
    private double predictedCost;
    private double predictedDuration;
}

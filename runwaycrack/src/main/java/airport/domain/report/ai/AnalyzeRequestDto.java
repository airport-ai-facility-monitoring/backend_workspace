package airport.domain.report.ai;


import lombok.Data;

@Data
public class AnalyzeRequestDto {
    private int pavement_type_concrete;
    private int epoxy_used;
    private int wiremesh_used;
    private int joint_seal_used;
    private int rebar_used;
    private int polymer_used;
    private int sealing_used;
    private int predictedCost;
    private int predictedDuration;
}

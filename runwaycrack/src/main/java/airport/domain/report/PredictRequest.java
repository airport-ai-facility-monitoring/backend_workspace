package airport.domain.report;

import java.util.*;
import lombok.Data;

@Data
public class PredictRequest {
    private double length_cm;
    private double avg_width_cm;
    private double area_m2;
    private double repair_area_m2;
    private int pavement_type_concrete;
    private int epoxy_used;
    private int wiremesh_used;
    private int joint_seal_used;
    private int rebar_used;
    private int polymer_used;
    private int sealing_used;
}
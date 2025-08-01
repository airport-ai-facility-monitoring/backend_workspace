package airport.domain;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
//<<< DDD / Aggregate Root
public class LightingEquipmentDetail {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lampType;  // LED, Halogen, Fluorescent
    private Integer powerConsumption;
}
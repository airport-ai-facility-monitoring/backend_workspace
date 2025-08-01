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
public class WeatherEquipmentDetail {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mountType; //pole, mast, surface, tripod
    private Integer powerConsumption;
}
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
public class SignEquipmentDetail {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String material; // Aluminum, Stainless Steel, Polycarbonate
    private String mountType; // pole, mast, surface, tripod
    private String signColor; // white, yellow, black, red
    private Integer panelWidth;
    private Integer panelHeight;
}
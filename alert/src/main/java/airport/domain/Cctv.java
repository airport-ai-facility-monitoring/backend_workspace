package airport.domain;

import airport.AlertApplication;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Cctv_table")
@Data
//<<< DDD / Aggregate Root
public class Cctv {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long cctvId;

    private String cctvUrl;

    private String cctvArea;

    public static CctvRepository repository() {
        CctvRepository cctvRepository = AlertApplication.applicationContext.getBean(
            CctvRepository.class
        );
        return cctvRepository;
    }
}
//>>> DDD / Aggregate Root

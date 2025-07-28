package airport.domain;

import airport.RunwaycrackApplication;
import airport.domain.DamageDetected;
import airport.domain.ReportRequested;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "RunwayCrack_table")
@Data
//<<< DDD / Aggregate Root
public class RunwayCrack {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long rcId;

    private String imageUrl;

    private Long cctvId;

    private Integer size;

    public static RunwayCrackRepository repository() {
        RunwayCrackRepository runwayCrackRepository = RunwaycrackApplication.applicationContext.getBean(
            RunwayCrackRepository.class
        );
        return runwayCrackRepository;
    }
}
//>>> DDD / Aggregate Root

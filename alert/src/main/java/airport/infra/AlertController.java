package airport.infra;

import airport.domain.*;
import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/alerts") // RequestMapping 추가
@Transactional
public class AlertController {

    @Autowired
    AlertRepository alertRepository;

    @GetMapping
    public List<Alert> getAllAlerts() {
        return (List<Alert>) alertRepository.findAll();
    }
}
//>>> Clean Arch / Inbound Adaptor

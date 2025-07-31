package airport.infra;

import airport.domain.*;
import airport.domain.User.User;
import airport.domain.User.UserRepository;
import reactor.core.publisher.Mono;

import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/employees")
@Transactional
public class EmployeeController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/setting")
    public User getEmployeeById(
        @RequestHeader("X-Employee-Id") String employeeId
     ) {
        System.out.println("🚀 [employeeId 헤더 값]: " + employeeId); // 로그 확인용
        Long employeeIdLong = Long.valueOf(employeeId);
        return userRepository.findByEmployeeId(employeeIdLong)
                .orElseThrow(() -> new RuntimeException("해당 직원이 없습니다."));
    }


}

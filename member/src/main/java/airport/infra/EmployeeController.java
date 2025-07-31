package airport.infra;

import airport.domain.*;
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
// @RequestMapping(value="/employees")
@Transactional
public class EmployeeController {

    // @Autowired
    // UserRepository userRepository;
    // @GetMapping("/employees/{id}")
    // public Mono<Employee> getEmployeeById(
    //     @PathVariable Long id,
    //     @RequestHeader("X-Employee-Id") String employeeIdHeader) {

    //     System.out.println("인증된 employeeId: " + employeeIdHeader);

    //     Long employeeId;
    //     try {
    //         employeeId = Long.valueOf(employeeIdHeader);
    //     } catch (NumberFormatException e) {
    //         return Mono.error(new IllegalArgumentException("X-Employee-Id 헤더가 유효하지 않습니다."));
    //     }

    //     // employeeId를 이용해 DB에서 Employee 조회 (예: ReactiveCrudRepository 사용)
    //     return userRepository.findByEmployeeId(employeeId)
    //             .switchIfEmpty(Mono.error(new RuntimeException("해당 직원이 없습니다.")));
    // }

    // @GetMapping("/employees/{id}")
    // public Optional<Employee> getEmployeeById(@PathVariable Long id) {
    //      return employeeRepository.findById(id);

    // }

//>>> Clean Arch / Inbound Adaptor
}

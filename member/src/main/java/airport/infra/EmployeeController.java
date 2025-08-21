package airport.infra;

import airport.domain.*;
import airport.domain.User.User;
import airport.domain.User.UserDto;
import airport.domain.User.UserRepository;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping("/api/employees")
@Transactional
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @PostMapping
    public Employee registerEmployee(@RequestBody Employee employee) {
        if (employeeRepository.findById(employee.getEmployeeId()).isPresent()) {
            throw new RuntimeException("이미 등록된 사번입니다.");
        }
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long employeeId) {
        // 1. Employee 삭제
        employeeRepository.deleteById(employeeId);
        
        if (userRepository.existsByEmployeeId(employeeId)) {
            userRepository.deleteByEmployeeId(employeeId);
        }
        return ResponseEntity.noContent().build();
    }
}
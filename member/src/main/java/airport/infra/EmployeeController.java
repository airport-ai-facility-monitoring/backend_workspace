package airport.infra;

import airport.domain.*;
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
// @RequestMapping(value="/employees")
@Transactional
public class EmployeeController {

    @Autowired
    EmployeeRepository employeeRepository;

    // @GetMapping("/employees/{id}")
    // public Optional<Employee> getEmployeeById(@PathVariable Long id) {
    //     return employeeRepository.findById(id);
    // }

    // @GetMapping("/employees/{id}")
    // public Optional<Employee> getEmployeeById(@PathVariable Long id) {
    //      return employeeRepository.findById(id);

    // }

//>>> Clean Arch / Inbound Adaptor

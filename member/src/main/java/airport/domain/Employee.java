package airport.domain;

import airport.MemberApplication;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Employee_table")
@Data
//<<< DDD / Aggregate Root
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long employeeId;

    private String name;

    private String department;

    private String position;

    private Date hireDate;

    private String phoneNumber;

    private String email;

    public static EmployeeRepository repository() {
        EmployeeRepository employeeRepository = MemberApplication.applicationContext.getBean(
            EmployeeRepository.class
        );
        return employeeRepository;
    }
}
//>>> DDD / Aggregate Root

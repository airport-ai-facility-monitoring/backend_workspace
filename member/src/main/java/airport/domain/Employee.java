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
import lombok.ToString;

@Entity
@Table(name = "Employee_table", schema = "member")
@Data
@ToString

//<<< DDD / Aggregate Root
public class Employee {

    @Id
    @Column(name = "employee_id")
    private Long employeeId;


    public static EmployeeRepository repository() {
        EmployeeRepository employeeRepository = MemberApplication.applicationContext.getBean(
            EmployeeRepository.class
        );
        return employeeRepository;
    }
}
//>>> DDD / Aggregate Root

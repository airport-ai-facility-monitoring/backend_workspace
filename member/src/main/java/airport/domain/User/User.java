package airport.domain.User;

import airport.MemberApplication;
import airport.domain.Employee;
import airport.domain.RequestApproved;
import airport.domain.RequestRejected;
import airport.domain.SignupRequested;

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
@Table(name = "User_table")
@Data
@ToString

//<<< DDD / Aggregate Root
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String password;

    private Long employeeId;

    private String name;

    private String department;

    private String position;

    private Date hireDate;

    private String phoneNumber;

    private String email;


    private String status;

    @PostPersist
    public void onPostPersist() {
        SignupRequested signupRequested = new SignupRequested(this);
        signupRequested.publishAfterCommit();

        RequestApproved requestApproved = new RequestApproved(this);
        requestApproved.publishAfterCommit();
    }

    @PreRemove
    public void onPreRemove() {
        RequestRejected requestRejected = new RequestRejected(this);
        requestRejected.publishAfterCommit();
    }

    public static UserRepository repository() {
        UserRepository userRepository = MemberApplication.applicationContext.getBean(
            UserRepository.class
        );
        return userRepository;
    }
}
//>>> DDD / Aggregate Root

class UserDto{
        private Long id;

    private String password;

    private Long employeeId;

    private String name;

    private String department;

    private String position;

    private Date hireDate;

    private String phoneNumber;

    private String email;

}
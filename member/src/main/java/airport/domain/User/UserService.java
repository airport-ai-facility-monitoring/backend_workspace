package airport.domain.User;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import airport.domain.Employee;
import airport.domain.EmployeeRepository;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;

    public void join(String password, Long employeeId){
        User user = new User();
        user.setPassword(password);
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new IllegalArgumentException("해당 직원이 없습니다: " + employeeId));

        user.setEmployee(employee);
    
        if(user.getEmployee() != null && user.getPassword() != null){
            if(!userRepository.findByEmployee(user.getEmployee()).isPresent()){
                var result = passwordEncoder.encode(user.getPassword());
                user.setPassword(result);
                userRepository.save(user);
            }else{
                throw new RuntimeException("이미 가입됨");
            }
        }else{
            throw new RuntimeException("니 잘못임");
        }

    }


}

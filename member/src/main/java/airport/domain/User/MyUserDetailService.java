package airport.domain.User;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import airport.domain.Employee;
import airport.domain.EmployeeRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
@Service
public class MyUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String employeeId) throws UsernameNotFoundException {
        Long empId;

        try {
            empId = Long.valueOf(employeeId);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Employee ID가 올바른 숫자가 아닙니다: " + employeeId);
        }
        var result = userRepository.findByEmployeeId(empId);
        
        if(result.isEmpty()){
            throw new UsernameNotFoundException("에러");
        }

        var user = result.get();
        List<GrantedAuthority> authorities = new ArrayList<>();
        if(empId == 1L){
            authorities.add(new SimpleGrantedAuthority("ADMIN"));
        }else{
            authorities.add(new SimpleGrantedAuthority("USER"));
        }

        var a = new CustomUser(employeeId, user.getPassword(), authorities);

        return a;
    }
}



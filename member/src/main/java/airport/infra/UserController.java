package airport.infra;

import airport.config.security.JwtUtil;
import airport.domain.*;
import airport.domain.User.User;
import airport.domain.User.UserRepository;
import lombok.Getter;
import lombok.ToString;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

//<<< Clean Arch / Inbound Adaptor

@RestController
// @RequestMapping(value="/users")
@Transactional
public class UserController {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;
    @GetMapping("/employee")
    public String employee1() {
        Employee employee = employeeRepository.findById(1L).orElseThrow();
        var user = userRepository.findByEmployee(employee)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        return user.getEmployee().getPhoneNumber();
    } 

    @GetMapping("/users/employee/{id}")
    public String employee(@PathVariable Long id){
        Employee employee = employeeRepository.findById(id).orElseThrow();
        var result = userRepository.findByEmployee(employee);

        if (result.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저를 찾을 수 없습니다.");
        }

        System.out.println(result.get().getEmployee());
        return "";
    }   

    @PostMapping("/login/jwt")
    @ResponseBody
    public String loginJWT(@RequestBody Map<String, String> data,
                           HttpServletResponse response){
        System.out.println("Aa");
        var authToken = new UsernamePasswordAuthenticationToken(
            data.get("employeeId"),
            data.get("password")
        );

        var auth = authenticationManagerBuilder.getObject().authenticate(authToken);
        // auth 등록
        SecurityContextHolder.getContext().setAuthentication(auth);
        // auth 변수 쓰고싶으면
//        SecurityContextHolder.getContext().getAuthentication();

        // jwt 만들어서 보내주세요~
        var jwt = jwtUtil.createToken(SecurityContextHolder.getContext().getAuthentication());
        System.out.println(jwt);

        var cookie = new Cookie("jwt", jwt);
        cookie.setMaxAge(10);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return jwt;
    }

}

@Getter
@ToString
class UserDto {
    private String password;
    private Employee employee;

    public UserDto(User user) {
        this.password = user.getPassword();
        this.employee = user.getEmployee();
    }

    // getter 생략
}
//>>> Clean Arch / Inbound Adaptor

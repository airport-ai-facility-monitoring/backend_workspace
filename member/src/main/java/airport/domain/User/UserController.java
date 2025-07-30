package airport.domain.User;

import airport.config.security.JwtUtil;
import airport.domain.*;
import lombok.Getter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

//<<< Clean Arch / Inbound Adaptor

@RestController
@RequestMapping(value="/users")
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

    @Autowired
    UserService userService;

    @PostMapping()
    public ResponseEntity<Map<String, Object>> employee2(@RequestBody Map<String, Object> req) {

        try {
            String password = (String) req.get("password");
            Long employeeId = Long.valueOf(String.valueOf(req.get("employeeId")));

            if (password == null || password.isEmpty()) {
                throw new IllegalArgumentException("password가 비어있습니다.");
            }

            userService.join(password, employeeId);
        } catch (Exception e) {
            throw new IllegalArgumentException("잘못된 요청 데이터입니다.", e);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "회원가입이 완료되었습니다.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login/jwt")
    @ResponseBody
    public String loginJWT(@RequestBody Map<String, Object> data,
                           HttpServletResponse response){
        var authToken = new UsernamePasswordAuthenticationToken(
            data.get("employeeId"),
            data.get("password")
        );

        var auth = authenticationManagerBuilder.getObject().authenticate(authToken);
        // auth 등록
        SecurityContextHolder.getContext().setAuthentication(auth);
        // auth 변수 쓰고싶으면
        // SecurityContextHolder.getContext().getAuthentication();

        // jwt 만들어서 보내주세요~
        var jwt = jwtUtil.createToken(SecurityContextHolder.getContext().getAuthentication());
        System.out.println(jwt);

        var cookie = new Cookie("jwt", jwt);
        cookie.setMaxAge(1000);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        return jwt;
    }

    @PostMapping("/users/logout")
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료
        response.addCookie(cookie);
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

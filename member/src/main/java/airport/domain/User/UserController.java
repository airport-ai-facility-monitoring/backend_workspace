package airport.domain.User;

import airport.config.security.JwtUtil;
import airport.domain.*;
import io.jsonwebtoken.Claims;
import lombok.Getter;
import lombok.ToString;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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
import org.springframework.security.core.Authentication;
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

    @Autowired
    MyUserDetailService myUserDetailService;

    // @PostMapping()
    // public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, Object> req) {
    //     try {
    //         // 필드 추출
    //         String password = (String) req.get("password");
    //         Long employeeId = Long.valueOf(String.valueOf(req.get("employeeId")));
    //         String name = (String) req.get("name");
    //         String department = (String) req.get("department");
    //         String position = (String) req.get("position");
    //         String hireDateStr = (String) req.get("hireDate");
    //         String phoneNumber = (String) req.get("phoneNumber");
    //         String email = (String) req.get("email");

    //         if (password == null || password.isEmpty()) {
    //             throw new IllegalArgumentException("password가 비어있습니다.");
    //         }
    //         if (employeeId == null) {
    //             throw new IllegalArgumentException("employeeId가 비어있습니다.");
    //         }

    //         // 날짜 변환
    //         Date hireDate = null;
    //         if (hireDateStr != null && !hireDateStr.isEmpty()) {
    //             hireDate = java.sql.Date.valueOf(hireDateStr); // "yyyy-MM-dd" 형식일 경우
    //         }

    //         // User 객체 생성
    //         User user = new User();
    //         user.setPassword(password);
    //         user.setEmployeeId(employeeId);
    //         user.setName(name);
    //         user.setDepartment(department);
    //         user.setPosition(position);
    //         user.setHireDate(hireDate);
    //         user.setPhoneNumber(phoneNumber);
    //         user.setEmail(email);

    //         // Service 호출 (저장)
    //         userService.join(user);

    //         // 응답 생성
    //         Map<String, Object> response = new HashMap<>();
    //         response.put("success", true);
    //         response.put("message", "회원가입이 완료되었습니다.");

    //         return ResponseEntity.ok(response);

    //     } catch (Exception e) {
    //         throw new IllegalArgumentException("잘못된 요청 데이터입니다.", e);
    //     }
    // }

    @GetMapping("/setting")
    public UserDto getEmployeeById(
        @RequestHeader("X-Employee-Id") String employeeId
     ) {
        System.out.println("🚀 [employeeId 헤더 값]: " + employeeId); // 로그 확인용
        Long employeeIdLong = Long.valueOf(employeeId);
        User user =  userRepository.findByEmployeeId(employeeIdLong)
                .orElseThrow(() -> new RuntimeException("해당 직원이 없습니다."));

        return new UserDto(user);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, Object> userData, HttpServletRequest request) {
        try {
            // 1. reCAPTCHA 토큰 검증
            String recaptchaToken = (String) userData.get("recaptchaToken");
            if (!userService.verifyRecaptcha(recaptchaToken, request)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "로봇으로 의심되는 접근입니다. 다시 시도해 주세요.");
                return ResponseEntity.badRequest().body(errorResponse);
            }else{
                System.out.println("인증성공");
            }
            
            // 2. User 객체에 데이터 바인딩
            User user = new User();
            // employeeId는 String으로 들어오므로 Long으로 변환
            user.setEmployeeId(Long.valueOf((String) userData.get("employeeId")));
            user.setPassword((String) userData.get("password"));
            user.setName((String) userData.get("name"));
            user.setDepartment((String) userData.get("department"));
            user.setPosition((String) userData.get("position"));
            user.setPhoneNumber((String) userData.get("phoneNumber"));
            user.setEmail((String) userData.get("email"));
            // hireDate는 String으로 들어오므로 Date로 변환
            try {
                if (userData.containsKey("hireDate") && userData.get("hireDate") != null) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date hireDate = sdf.parse((String) userData.get("hireDate"));
                    user.setHireDate(hireDate);
                }
            } catch (ParseException e) {
                // 날짜 형식 오류 처리
                throw new IllegalArgumentException("입사일자 형식이 올바르지 않습니다. (yyyy-MM-dd)");
            }

            userService.join(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("회원가입 실패: " + e.getMessage(), e);
        }
    }

    @PostMapping("/login/jwt")
    @ResponseBody
    public void loginJWT(@RequestBody Map<String, Object> data,
                        HttpServletResponse response,
                        HttpServletRequest request) {
        try {
            // 1. reCAPTCHA 토큰 검증
            String recaptchaToken = (String) data.get("recaptchaToken");
            if (!userService.verifyRecaptcha(recaptchaToken, request)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"로봇으로 의심되는 접근입니다.\"}");
                return;
            }
            // 1. employeeId 가져오기
            Long employeeId = Long.valueOf(String.valueOf(data.get("employeeId")));

            // 2. 사용자 조회
            User user = userRepository.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));

            // 3. 승인 여부 확인
            if (user.getStatus() == null || !user.getStatus().equals("APPROVE")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"승인되지 않은 아이디입니다.\"}");
                return;
            }

            // 4. 비밀번호 인증 (Spring Security 인증 로직 그대로)
            var authToken = new UsernamePasswordAuthenticationToken(
                    data.get("employeeId"),
                    data.get("password")
            );

            var auth = authenticationManagerBuilder.getObject().authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(auth);

            // 5. Access Token + Refresh Token 생성
            String accessToken = jwtUtil.createAccessToken(auth);
            String refreshToken = jwtUtil.createRefreshToken(auth);

            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);
            response.addCookie(refreshTokenCookie);

            // 6. 응답으로 Access Token 전송
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"accessToken\": \"" + accessToken + "\"}");

        } catch (RuntimeException e) {
            // 아이디 없음 또는 승인되지 않음
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            try {
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        } catch (Exception e) {
            // 비밀번호 불일치 등 인증 실패
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            try {
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"아이디 또는 비밀번호가 올바르지 않습니다.\"}");
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료
        response.addCookie(cookie);
    }

    @PostMapping("/users/refresh-token")
    @ResponseBody
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // 1. 쿠키에서 refreshToken 꺼내기
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token missing");
        }

        // 2. refreshToken 유효성 검사 및 만료 확인
        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }

        // 3. refreshToken 기반으로 사용자 정보 추출
        Claims claims = jwtUtil.extractToken(refreshToken);
        String employeeId = claims.get("employeeId", String.class);

        // 4. DB 등에서 refreshToken이 실제로 유효한지 추가 검증(선택사항)
        // 예: 저장된 refreshToken과 비교, 블랙리스트 체크 등

        // 5. 새로운 Access Token 생성
        CustomUser user = (CustomUser) myUserDetailService.loadUserByUsername(employeeId);
        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String newAccessToken = jwtUtil.createAccessToken(auth);

        // 6. 응답으로 Access Token JSON 반환
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

}

//>>> Clean Arch / Inbound Adaptor

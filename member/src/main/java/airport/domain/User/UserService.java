package airport.domain.User;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입: User 객체 전체를 받아서 저장
     */
    public void join(User user) {
        if (user.getEmployeeId() == null || user.getPassword() == null) {
            throw new RuntimeException("필수 입력값 누락");
        }

        // employeeId 중복 체크
        Optional<User> existing = userRepository.findByEmployeeId(user.getEmployeeId());
        if (existing.isPresent()) {
            throw new RuntimeException("이미 가입된 사번입니다.");
        }
        if(user.getEmployeeId() == 1){
            user.setStatus("APPROVE");
        }else{
            user.setStatus("APPROVE");
        }
        // 패스워드 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // 저장
        userRepository.save(user);
    }

    boolean verifyRecaptcha(String recaptchaToken, HttpServletRequest request) {
        if (recaptchaToken == null || recaptchaToken.isBlank()) {
            return false;
        }
        System.out.println(request);
        // Google reCAPTCHA siteverify API URL
        final String url = "https://www.google.com/recaptcha/api/siteverify";
        RestTemplate restTemplate = new RestTemplate();

        // API 요청에 필요한 파라미터
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("secret", "6Lc6s5krAAAAANHHG-m9eFbfQKD7osrRnPgQzLba");
        requestBody.put("response", recaptchaToken);
        // requestBody.put("remoteip", userIpAddress); // 클라이언트 IP도 검증에 사용될 수 있지만, 여기서는 생략

        try {
            // Google API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestBody, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            // reCAPTCHA 응답에서 success와 score 확인
            boolean success = jsonNode.get("success").asBoolean();
            double score = jsonNode.get("score").asDouble();

            // success가 true이고, 점수가 0.5 이상일 경우 성공으로 판단
            // 점수(score)는 0.0에서 1.0 사이이며, 1.0에 가까울수록 봇일 가능성이 낮습니다.
            return success && score >= 0.5;

        } catch (Exception e) {
            System.err.println("reCAPTCHA 검증 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
}
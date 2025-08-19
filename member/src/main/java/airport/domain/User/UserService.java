package airport.domain.User;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.http.HttpServletRequest;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // application.yml 또는 환경변수에서 주입 (예: recaptcha.secret)
    @Value("${recaptcha.secret:}")
    private String recaptchaSecret;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

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
            throw new DuplicateEmployeeIdException("이미 가입된 사번입니다.");
        }
        if (user.getEmployeeId() == 1) {
            user.setStatus("APPROVE");
        } else {
            user.setStatus("APPROVE");
        }
        // 패스워드 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // 저장
        userRepository.save(user);
    }

    boolean verifyRecaptcha(String recaptchaToken, HttpServletRequest request) {
        if (recaptchaToken == null || recaptchaToken.isBlank()) {
            System.err.println("recaptchaToken이 비어있음.");
            return false;
        }
        if (recaptchaSecret == null || recaptchaSecret.isBlank()) {
            System.err.println("reCAPTCHA secret 키가 설정되지 않았습니다.");
            return false;
        }

        // RestTemplate + 타임아웃 설정
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5초 연결 타임아웃
        factory.setReadTimeout(5000);    // 5초 읽기 타임아웃
        RestTemplate restTemplate = new RestTemplate(factory);

        // form-urlencoded body 구성
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("secret", recaptchaSecret);
        form.add("response", recaptchaToken);

        String remoteIp = request.getRemoteAddr();
        if (remoteIp != null && !remoteIp.isBlank()) {
            form.add("remoteip", remoteIp);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(form, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(VERIFY_URL, httpEntity, String.class);
            System.out.println(response);
            if (response == null || response.getBody() == null) {
                System.err.println("reCAPTCHA API 응답이 비어있음.");
                return false;
            }

            if (!response.getStatusCode().is2xxSuccessful()) {
                System.err.printf("reCAPTCHA API 호출 실패. 상태 코드: %d, 본문: %s%n",
                        response.getStatusCodeValue(), response.getBody());
                return false;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            boolean success = jsonNode.path("success").asBoolean(false);
            double score = jsonNode.has("score") ? jsonNode.get("score").asDouble(-1.0) : -1.0; // v2엔 score 없음
            JsonNode errorCodesNode = jsonNode.get("error-codes");

            // 디버깅 로그
            System.out.println("reCAPTCHA API Response: " + response.getBody());
            System.out.println("success=" + success + ", score=" + score);
            if (errorCodesNode != null && errorCodesNode.isArray()) {
                System.out.print("error-codes: ");
                errorCodesNode.forEach(ec -> System.out.print(ec.asText() + " "));
                System.out.println();
            }

            if (!success) {
                return false;
            }

            // v3인 경우 score 기준 체크 (threshold: 0.5)
            if (score >= 0) {
                return score >= 0.5;
            } else {
                // v2: score가 없으므로 success만으로 판단
                return true;
            }

        } catch (HttpClientErrorException e) {
            System.err.printf("HTTP 에러: %s, 본문: %s%n", e.getStatusCode(), e.getResponseBodyAsString());
            return false;
        } catch (Exception e) {
            System.err.println("reCAPTCHA 검증 중 예외 발생: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
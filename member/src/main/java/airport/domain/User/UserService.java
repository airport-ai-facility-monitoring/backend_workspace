package airport.domain.User;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
            user.setStatus("PENDING");
        }
        // 패스워드 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // 저장
        userRepository.save(user);
    }
}
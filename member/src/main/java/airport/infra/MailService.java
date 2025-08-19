// src/main/java/airport/infra/MailService.java
package airport.infra;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MailService {

    @Autowired(required = false)
    @Nullable
    private JavaMailSender mailSender;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${app.mail.from:noreply@localhost}")
    private String from;

    public void sendPasswordResetCode(String to, String code) {
        if (mailSender == null || mailHost == null || mailHost.isBlank()) {
            log.warn("[Mail] 미구성 - 발송 스킵 (to={}, code={})", to, code);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);                    // ✅ 발신자 명시
            msg.setTo(to);
            msg.setSubject("[공항 시스템] 비밀번호 재설정 인증코드");
            msg.setText("인증코드: " + code + "\n유효시간: 10분");
            mailSender.send(msg);
            log.info("[Mail] 발송 성공 (to={})", to);
        } catch (MailException e) {
            // 500로 터뜨리지 말고 로그만
            log.warn("[Mail] 발송 실패 (to={}, err={})", to, e.getMessage());
        }
    }
}

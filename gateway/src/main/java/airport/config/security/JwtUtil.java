package airport.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    private final SecretKey key;

    // jwt 생성
    public JwtUtil(JwtConfig jwtConfig) {
        this.key = jwtConfig.getSecretKey(); // 여기서 초기화
    }

    // jwt 까주는함수
    public Claims extractToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();

        return claims;
    }

}

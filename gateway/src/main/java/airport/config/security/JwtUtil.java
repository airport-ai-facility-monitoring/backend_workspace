package airport.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(JwtConfig jwtConfig) {
        this.key = jwtConfig.getSecretKey();
    }



    // jwt 까주는함수
    public Claims extractToken(String token){
        Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();

        return claims;
    }

    // 토큰 유효성 체크 (예외 발생 시 false 반환)
    public boolean validateToken(String token) {
        try {
            extractToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
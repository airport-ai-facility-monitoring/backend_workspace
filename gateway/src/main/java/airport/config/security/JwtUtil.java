package airport.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.security.SignatureException;
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
        } catch (ExpiredJwtException e) {
            System.out.println("토큰 만료됨");
        } catch (UnsupportedJwtException e) {
            System.out.println("지원하지 않는 토큰");
        } catch (MalformedJwtException e) {
            System.out.println("잘못된 토큰 형식");
        }  catch (IllegalArgumentException e) {
            System.out.println("잘못된 인자");
        }
        return false;
    }
}
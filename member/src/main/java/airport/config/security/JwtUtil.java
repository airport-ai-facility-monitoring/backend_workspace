package airport.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import airport.domain.User.CustomUser;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final SecretKey key;
    // jwt 생성
    public JwtUtil(JwtConfig jwtConfig) {
        this.key = jwtConfig.getSecretKey();  // 여기서 초기화
    }

    public String createAccessToken(Authentication auth) {

        CustomUser user = (CustomUser) auth.getPrincipal();
        var authorities = auth.getAuthorities().stream()
                .map(a-> a.getAuthority())
                .collect(Collectors.joining(","));
        String jwt = Jwts.builder()
                .claim("employeeId", user.getUsername())
                .claim("authorities", authorities)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 1000))
                .signWith(key)
                .compact();

        return jwt;
    }

    public String createRefreshToken(Authentication auth) {

        CustomUser user = (CustomUser) auth.getPrincipal();
        var authorities = auth.getAuthorities().stream()
                .map(a-> a.getAuthority())
                .collect(Collectors.joining(","));
        String jwt = Jwts.builder()
                .claim("employeeId", user.getUsername())
                .claim("authorities", authorities)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7))
                .signWith(key)
                .compact();

        return jwt;
    }

    // jwt 까주는함수
    public Claims extractToken(String token){
        Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();

        return claims;
    }

     // 토큰 유효성 체크
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            // 만료, 위변조 등 예외 발생 시 false 반환
            return false;
        }
    }

}

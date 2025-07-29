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

    public String createToken(Authentication auth) {

        CustomUser user = (CustomUser) auth.getPrincipal();
        var authorities = auth.getAuthorities().stream()
                .map(a-> a.getAuthority())
                .collect(Collectors.joining(","));
        String jwt = Jwts.builder()
                .claim("username", user.getUsername())
                .claim("employeeId", user.getEmployeeId())
                .claim("authorities", authorities)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 1000)) // 유효시간 10초
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

}

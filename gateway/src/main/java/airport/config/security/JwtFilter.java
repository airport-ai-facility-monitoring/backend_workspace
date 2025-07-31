package airport.config.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

import java.net.URI;

import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();

        // 토큰 가져오기 (쿠키 or Authorization 헤더)
        String token = null;
        
        // ✅ OPTIONS 요청은 무조건 통과시킴 (Preflight)
        if (request.getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        if (request.getPath().toString().startsWith("/users") 
            || request.getPath().toString().startsWith("/users/login/jwt")
        || request.getPath().toString().startsWith("users/refresh-token")) {
            return chain.filter(exchange); // 토큰 검사 안 함
        }

        MultiValueMap<String, HttpCookie> cookies = request.getCookies();
        if (cookies != null && cookies.containsKey("jwt")) {
            HttpCookie jwtCookie = cookies.getFirst("jwt");
            if (jwtCookie != null) {
                token = jwtCookie.getValue();
            }
        }

        if (token == null) {
            String authHeader = request.getHeaders().getFirst("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        // 토큰 검증
        if (!jwtUtil.validateToken(token)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        // Claims 추출 → 사용자 정보 헤더에 추가
        Claims claims = jwtUtil.extractToken(token);
        String employeeId = claims.get("employeeId", String.class);
        String authorities = claims.get("authorities", String.class);

        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-Employee-Id", employeeId)
                .header("X-Authorities", authorities)
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }
}

package airport.config.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpCookie;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
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

        String path = request.getPath().toString();
        // 임시
        System.out.println(path);
        // if (true) {
        //     return chain.filter(exchange); 
        // }

        if (path.equals("/") || 
            path.equals("/api/users/signup") || 
            path.equals("/api/users/login/jwt") || 
            path.equals("/api/users/refresh-token") ||
            request.getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
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


        if(token == null || !jwtUtil.validateToken(token)) {
            return chain.filter(exchange);
        }
                    System.out.println("토큰 값: " + token);
            System.out.println("토큰 유효 여부: " + jwtUtil.validateToken(token));
        // 토큰 검증
        if (!jwtUtil.validateToken(token)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        // Claims 추출 → 사용자 정보 헤더에 추가
        Claims claims = jwtUtil.extractToken(token);
        String employeeId = claims.get("employeeId", String.class);
        String authoritiesString = claims.get("authorities", String.class);

        List<SimpleGrantedAuthority> authorities = Arrays.stream(authoritiesString.split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // 인증 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(employeeId, null, authorities);


        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-Employee-Id", employeeId)
                .header("X-Authorities", authoritiesString)
                .build();

                
        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(mutatedRequest)
                .build();

        System.out.println("헤더 붙은 후: " + mutatedRequest.getHeaders());

        return chain.filter(mutatedExchange)
            .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
    }
}

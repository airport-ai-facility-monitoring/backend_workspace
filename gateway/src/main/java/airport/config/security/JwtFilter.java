package airport.config.security;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtFilter extends AbstractGatewayFilterFactory<JwtFilter.Config> {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();

            String token = null;
            MultiValueMap<String, HttpCookie> cookies = request.getCookies();
            if (cookies != null && cookies.containsKey("jwt")) {
                token = cookies.getFirst("jwt").getValue();
            }

            if (token == null) {
                return onError(response, "No JWT cookie found", HttpStatus.UNAUTHORIZED);
            }

            try {
                Claims claims = jwtUtil.extractToken(token);
                String username = claims.get("username", String.class);
                String employeeId = String.valueOf(claims.get("employeeId"));
                String authorities = claims.get("authorities", String.class);

                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Name", username)
                        .header("X-Employee-Id", employeeId)
                        .header("X-Authorities", authorities)
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                return onError(response, "Invalid token", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerHttpResponse response, String err, HttpStatus httpStatus) {
        response.setStatusCode(httpStatus);
        response.getHeaders().add("Content-Type", "application/json");
        return response.writeWith(Mono.just(response.bufferFactory().wrap(err.getBytes())));
    }

    public static class Config {
        // Configuration properties can be defined here
    }
}
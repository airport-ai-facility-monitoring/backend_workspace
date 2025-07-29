package airport.config.security;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;

    public AuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();

            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(response, "No authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authorizationHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            String token = authorizationHeader.replace("Bearer ", "");

            try {
                Claims claims = jwtUtil.extractToken(token);
                String username = claims.get("username", String.class);
                // In Spring Cloud Gateway, the claim might be an Integer if it was added as a Long in the member service.
                // Let's handle that by getting it as an object and converting to String.
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
        // To prevent issues with Netty buffer leaks, it's safer to create a new buffer.
        return response.writeWith(Mono.just(response.bufferFactory().wrap(err.getBytes())));
    }

    public static class Config {
        // Configuration properties for the filter can be defined here.
    }
}

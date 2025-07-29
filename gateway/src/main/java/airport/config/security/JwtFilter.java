package airport.config.security;

import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
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
    private final JwtProperties jwtProperties;

    public JwtFilter(JwtUtil jwtUtil, JwtProperties jwtProperties) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
        this.jwtProperties = jwtProperties;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();

            // 1. Check if the request path is in the excluded list
            if (jwtProperties.getExcludedPaths().contains(request.getPath().value())) {
                return chain.filter(exchange); // Skip JWT validation
            }

            // 2. Get JWT from cookie
            String token = null;
            MultiValueMap<String, HttpCookie> cookies = request.getCookies();
            if (cookies != null && cookies.containsKey("jwt")) {
                token = cookies.getFirst("jwt").getValue();
            }

            if (token == null) {
                return onError(response, "No JWT cookie found", HttpStatus.UNAUTHORIZED);
            }

            // 3. Validate token and add user info to headers
            try {
                Claims claims = jwtUtil.extractToken(token);
                String employeeId = String.valueOf(claims.get("employeeId"));
                String authorities = claims.get("authorities", String.class);

                ServerHttpRequest modifiedRequest = request.mutate()
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

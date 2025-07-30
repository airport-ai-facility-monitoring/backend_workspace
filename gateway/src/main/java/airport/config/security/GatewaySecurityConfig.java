package airport.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

    private final JwtFilter jwtFilter;

    public GatewaySecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf().disable()  // CSRF 비활성화 (API Gateway는 일반적으로 disable함)
                .authorizeExchange()
                        .pathMatchers("/user", "/login/jwt").permitAll() // 인증 없이 접근 허용
                        .anyExchange().authenticated() // 나머지는 인증 필요
                // JwtFilter를 인증 필터 앞에 위치시킴
                .and()
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
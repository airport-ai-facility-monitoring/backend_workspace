package airport.config.security;

import lombok.RequiredArgsConstructor;
import lombok.var;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.OrServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.PathPatternParserServerWebExchangeMatcher;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class GatewaySecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {


        return http
                // .securityMatcher(matcher)
                .cors().and()
                .httpBasic().disable()
                .csrf().disable()
                .authorizeExchange()
                    .pathMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                    .pathMatchers("/", "/users/signup", "/users/login/jwt").permitAll()
                    .anyExchange().authenticated()
                .and()
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
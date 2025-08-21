package airport.config.security;

import lombok.RequiredArgsConstructor;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class GatewaySecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {


        return http
                .cors().and() // Modified here
                .httpBasic().disable()
                .csrf().disable()
                .authorizeExchange(exchanges -> exchanges
                .pathMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // 임시 /**
                .pathMatchers("/", "/app/", "/app/**", "/api/users/signup", "/api/users/login/jwt", "/path2.svg", "/api/users/password-reset/**" ).permitAll() // Added /alerts/**
                .anyExchange().authenticated() // Changed back to authenticated()
                ).exceptionHandling(exceptions -> exceptions
                    .authenticationEntryPoint((exchange, ex) -> {
                        HttpStatus status = (ex instanceof org.springframework.security.authentication.AuthenticationCredentialsNotFoundException)
                                            ? HttpStatus.UNAUTHORIZED
                                            : HttpStatus.FORBIDDEN;
                        exchange.getResponse().setStatusCode(status);
                        return exchange.getResponse().setComplete();
                    })
                )
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION) // Added back
                .build();
    }

}

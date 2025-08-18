package airport.config.security;

import lombok.RequiredArgsConstructor;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                .cors().configurationSource(corsConfigurationSource()).and() // Modified here
                .httpBasic().disable()
                .csrf().disable()
                .authorizeExchange(exchanges -> exchanges
                .pathMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // 임시 /**
                .pathMatchers("/", "/app/", "/app/**", "/users/signup", "/users/login/jwt", "/path2.svg", "/alerts/**").permitAll() // Added /alerts/**
                .anyExchange().authenticated() // Changed back to authenticated()
                )
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION) // Added back
                .build();
    }

    @Bean // New bean method
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173"); // Specific origin for frontend
        configuration.addAllowedMethod("*"); // Allow all methods
        configuration.addAllowedHeader("*"); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean // New bean method to clear headers
    public WebFilter corsHeaderClearFilter() {
        return (exchange, chain) -> {
            exchange.getResponse().getHeaders().remove("Access-Control-Allow-Origin");
            exchange.getResponse().getHeaders().remove("Access-Control-Allow-Credentials");
            return chain.filter(exchange);
        };
    }
}

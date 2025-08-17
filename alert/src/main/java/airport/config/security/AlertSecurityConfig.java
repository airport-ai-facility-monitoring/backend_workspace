package airport.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class AlertSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF for API
            .authorizeHttpRequests(authorize -> authorize
                .antMatchers("/alerts/**").permitAll() // Permit access to /alerts/**
                .anyRequest().authenticated() // All other requests require authentication
            );
        return http.build();
    }
}

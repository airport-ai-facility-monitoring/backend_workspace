package airport.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.ExceptionTranslationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) // Spring Boot 2.x에서는 이거!
public class SecurityConfig {

    @Bean
    public JwtFilter jwtFilter(JwtUtil jwtUtil) {
        return new JwtFilter(jwtUtil);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        // csrf 기능 키는법
//        http.csrf(csrf -> csrf.csrfTokenRepository(csrfTokenRepository())
//                .ignoringRequestMatchers("/login")
//        );
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );
        // csrf 미사용
        http.csrf((csrf)->csrf.disable());

        http.addFilterBefore(jwtFilter, ExceptionTranslationFilter.class);
        http.authorizeRequests()
                .antMatchers("/**").permitAll()
                .anyRequest().authenticated();

//        http.formLogin((formLogin)
//                -> formLogin.loginPage("/login")
//                .defaultSuccessUrl("/list")
//                .permitAll()
//        );

        http.logout(logout -> logout
                .logoutUrl("/logout")
                .invalidateHttpSession(true)       // 세션 무효화
                .deleteCookies("JSESSIONID")
        );// 쿠키 삭제);
        return http.build();
    }
}

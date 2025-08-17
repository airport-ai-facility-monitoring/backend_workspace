// equipmentAnalysis/src/main/java/airport/config/SecurityConfig.java
package airport.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors().disable()     // ⬅️ 여기 포인트: 서비스 레벨 CORS 비활성화
      .csrf().disable()
      .httpBasic().disable()
      .formLogin().disable()
      .authorizeRequests()
        .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .antMatchers("/equip/**").permitAll()
        .antMatchers("/equipmentReports/**").permitAll()
        .anyRequest().authenticated();
    return http.build();
  }
}

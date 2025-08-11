package airport.config;

import java.time.Duration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestClientConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder b) {
        return b
            .setConnectTimeout(Duration.ofMillis(2000))
            .setReadTimeout(Duration.ofMillis(5000))
            .build();
    }
}
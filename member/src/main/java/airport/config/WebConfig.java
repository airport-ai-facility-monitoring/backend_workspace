package airport.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // allowCredentials(true)와 함께 사용 가능
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 예: /uploads/** 요청이 실제 서버의 /uploads 폴더로 매핑됨
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/workspaces/backend_workspace/notification/uploads/"); // 실제 업로드 경로로 변경
    }
}

package airport.infra;

import org.springframework.stereotype.Component;
import java.util.Set;

@Component
public class FilePolicy {
    // 허용 확장자(소문자, 점 제외)
    public final Set<String> ALLOWED_EXT = Set.of("jpg","jpeg","png","pdf");
    // 허용 MIME
    public final Set<String> ALLOWED_MIME = Set.of("image/jpeg","image/png","application/pdf");
    // 개수/크기 제한
    public final int MAX_COUNT = 1;                // 지금은 단일 파일
    public final long MAX_SIZE = 5L * 1024 * 1024; // 5MB
}
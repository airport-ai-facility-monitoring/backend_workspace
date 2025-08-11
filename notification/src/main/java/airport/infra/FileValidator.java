package airport.infra;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FileValidator {
    private final FilePolicy policy;

    public void validateFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) throw new IllegalArgumentException("첨부 파일이 없습니다.");
        if (files.size() > policy.MAX_COUNT) throw new IllegalArgumentException("파일 개수 초과");

        for (MultipartFile f : files) validateOne(f);
    }

    public void validateOne(MultipartFile f) {
        if (f == null || f.isEmpty()) throw new IllegalArgumentException("빈 파일 업로드는 허용되지 않습니다.");
        if (f.getSize() > policy.MAX_SIZE) throw new IllegalArgumentException("파일 크기(5MB) 초과");

        String original = Optional.ofNullable(f.getOriginalFilename()).orElse("");
        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.') + 1).toLowerCase() : "";
        if (!policy.ALLOWED_EXT.contains(ext)) throw new IllegalArgumentException("허용되지 않는 확장자");

        String mime = Optional.ofNullable(f.getContentType()).orElse("");
        if (!policy.ALLOWED_MIME.contains(mime)) throw new IllegalArgumentException("허용되지 않는 파일 형식(MIME)");
    }
}
package airport.infra;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

     private final String uploadDir = System.getProperty("user.dir") + "/uploads";

    public String save(MultipartFile file) {
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // 폴더 없으면 생성
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new RuntimeException("파일 이름이 비어 있습니다.");
            }

            String newFilename = UUID.randomUUID() + "_" + originalFilename;
            String filePath = uploadDir + newFilename;

            file.transferTo(new File(filePath));
            return "/uploads/" + newFilename;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("파일 저장 중 오류 발생: " + e.getMessage());
        }
    }
}
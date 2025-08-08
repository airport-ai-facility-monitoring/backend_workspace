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

    /**
     * 새 파일 저장 + 기존 파일 삭제
     * @param file 새로 저장할 파일
     * @param oldFileUrl 기존 파일 URL (없으면 null)
     * @return 새 파일의 접근 URL
     */
    public String save(MultipartFile file, String oldFileUrl) {
        try {
            // 기존 파일 삭제
            if (oldFileUrl != null && !oldFileUrl.isEmpty()) {
                deleteByUrl(oldFileUrl);
            }

            // 업로드 폴더 확인
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new RuntimeException("파일 이름이 비어 있습니다.");
            }

            // 새 파일명 생성
            String newFilename = UUID.randomUUID() + "_" + originalFilename;
            String filePath = uploadDir + "/" + newFilename;

            // 파일 저장
            file.transferTo(new File(filePath));

            // URL 반환
            return "/uploads/" + newFilename;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("파일 저장 중 오류 발생: " + e.getMessage());
        }
    }

    public String save(MultipartFile file) {
        return save(file, null); // 기존 파일 없음
    }

    /**
     * URL 기반으로 파일 삭제
     */
    public void deleteByUrl(String fileUrl) {
        try {
            String fileName = Paths.get(fileUrl).getFileName().toString();
            Path path = Paths.get(uploadDir, fileName); // 저장 경로 그대로 사용

            if (Files.exists(path)) {
                Files.delete(path);
                System.out.println("파일 삭제 완료: " + path);
            } else {
                System.out.println("삭제 대상 파일이 존재하지 않음: " + path);
            }
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 중 오류: " + e.getMessage(), e);
        }
    }

    /**
     * 파일 URL로부터 파일명 추출
     */
    public String extractFileName(String fileUrl) {
        return Paths.get(fileUrl).getFileName().toString();
    }
}
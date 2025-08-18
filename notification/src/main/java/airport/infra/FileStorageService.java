package airport.infra;

import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.storage.common.sas.SasProtocol;

import airport.domain.Notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageService {
@Value("${STORAGE_ACCOUNT_NAME}")
    private String storageAccountName;

    @Value("${STORAGE_ACCOUNT_KEY}")
    private String storageAccountKey;  // 계정 키 사용

    @Value("${CONTAINER_NAME}")
    private String containerName;

    /**
     * blobName 기반으로 SAS URL 생성
     */
    private String generateBlobSasUrl(String blobName) {
        // 1️⃣ 계정 인증
        StorageSharedKeyCredential credential =
                new StorageSharedKeyCredential(storageAccountName, storageAccountKey);

        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                .endpoint(String.format("https://%s.blob.core.windows.net", storageAccountName))
                .credential(credential)
                .buildClient();

        BlobContainerClient containerClient = serviceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // 2️⃣ SAS 권한 정의 (읽기 + 쓰기 + 삭제)
        BlobSasPermission permission = new BlobSasPermission()
                .setReadPermission(true)
                .setWritePermission(true)
                .setDeletePermission(true);

        // 3️⃣ SAS 토큰 유효기간 (예: 5분)
        OffsetDateTime expiryTime = OffsetDateTime.now().plusMinutes(5);

        BlobServiceSasSignatureValues values = new BlobServiceSasSignatureValues(expiryTime, permission)
                .setStartTime(OffsetDateTime.now())
                .setProtocol(SasProtocol.HTTPS_ONLY);

        // 4️⃣ SAS 토큰 생성
        String sasToken = blobClient.generateSas(values);

        // 5️⃣ SAS URL 반환
        return blobClient.getBlobUrl() + "?" + sasToken;
    }


    /**
     * 파일 저장 + 기존 파일 삭제 (Blob Storage)
     * 업로드는 하지 않고 SAS URL만 반환
     * @return Blob SAS URL
     */
    public String save(Notification notification, String filename) {
        try {
            // 기존 파일 삭제
            if (notification.getFileUrl() != null) {
                String temp = notification.getFileUrl();
                notification.setFileUrl("");
                notification.setOriginalFilename("");
                deleteByUrl(temp);
            }
            String url = String.format("https://%s.blob.core.windows.net/%s/%s", storageAccountName, containerName, filename);
            notification.setFileUrl(url);
            

            // 업로드는 스킵하고 SAS URL만 반환
            return generateBlobSasUrl(filename);

        } catch (Exception e) {
            throw new RuntimeException("Blob SAS URL 생성 중 오류: " + e.getMessage(), e);
        }
    }

    /**
     * Blob URL 기반 삭제
     */
    public void deleteByUrl(String blobUrl) {
        try {
            // blobUrl은 항상 https://{account}.blob.core.windows.net/{container}/{blobPath} 형태라고 가정
            String prefix = String.format("https://%s.blob.core.windows.net/%s/", storageAccountName, containerName);
            if (!blobUrl.startsWith(prefix)) {
                return; // 우리 스토리지가 아니면 무시
            }

            // container 이후 경로 추출
            String blobName = blobUrl.substring(prefix.length());
            if (blobName.contains("?")) {
                blobName = blobName.substring(0, blobName.indexOf("?"));
            }

            // BlobClient 생성
            StorageSharedKeyCredential credential =
                    new StorageSharedKeyCredential(storageAccountName, storageAccountKey);

            BlobServiceClient serviceClient = new BlobServiceClientBuilder()
                    .endpoint(String.format("https://%s.blob.core.windows.net", storageAccountName))
                    .credential(credential)
                    .buildClient();

            BlobContainerClient containerClient = serviceClient.getBlobContainerClient(containerName);
            BlobClient blobClient = containerClient.getBlobClient(blobName);

            // 삭제
            if (blobClient.exists()) {
                blobClient.delete();
            }

        } catch (Exception e) {
            throw new RuntimeException("Blob Storage 삭제 중 오류: " + e.getMessage(), e);
        }
    }
}
package com.backend.animeplay.service;

import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private final String VIDEO_UPLOAD_DIR = "uploads/videos/";
    private final String IMAGE_UPLOAD_DIR = "uploads/images/";

    public String storeVideoFile(MultipartFile file) {
        return storeFile(file, VIDEO_UPLOAD_DIR, "/videos/");
    }

    public String storeImageFile(MultipartFile file) {
        return storeFile(file, IMAGE_UPLOAD_DIR, "/images/");
    }

    private String storeFile(MultipartFile file, String uploadDir, String publicPrefix) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalName = file.getOriginalFilename();
            String safeName = originalName == null
                    ? "file"
                    : Paths.get(originalName).getFileName().toString().replaceAll("[^a-zA-Z0-9._-]", "_");
            String uniqueFileName = UUID.randomUUID() + "_" + safeName;
            Path filePath = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return publicPrefix + uniqueFileName;
        } catch (IOException e) {
            log.error("Could not store file", e);
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }
}

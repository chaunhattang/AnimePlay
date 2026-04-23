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

    public String storeVideoFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(VIDEO_UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(uniqueFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/videos/" + uniqueFileName;
        } catch (IOException e) {
            log.error("Could not store file", e);
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }
}
package com.backend.animeplay.configuration;

import com.cloudinary.Cloudinary;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CloudinaryConfig {
    @Value("${cloudinary.cloud-name}")
    protected String cloudName;

    @Value("${cloudinary.api-key}")
    protected String apiKey;

    @Value("${cloudinary.api-secret}")
    protected String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        if (cloudName == null || cloudName.isEmpty() || apiKey == null || apiKey.isEmpty() || apiSecret == null || apiSecret.isEmpty()) {
            log.warn("Cloudinary credentials are empty. Image upload will use local storage if configured by service.");
        } else {
            config.put("cloud_name", cloudName);
            config.put("api_key", apiKey);
            config.put("api_secret", apiSecret);
        }

        return new Cloudinary(config);
    }
}

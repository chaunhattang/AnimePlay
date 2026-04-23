package com.backend.animeplay.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path videoUploadDir = Paths.get("uploads/videos");
        String videoUploadPath = videoUploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/videos/**")
                .addResourceLocations("file:" + videoUploadPath + "/");
    }
}
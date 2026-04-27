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

        Path imageUploadDir = Paths.get("uploads/images");
        String imageUploadPath = imageUploadDir.toFile().getAbsolutePath();

        Path rootUploadDir = Paths.get("uploads");
        String rootUploadPath = rootUploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/videos/**")
                .addResourceLocations("file:///" + videoUploadPath + "/");
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///" + imageUploadPath + "/");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + rootUploadPath + "/");
    }
}
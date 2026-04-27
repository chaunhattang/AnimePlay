package com.backend.animeplay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableCaching
@SpringBootApplication
public class AnimePlayApplication {
    public static void main(String[] args) {
        SpringApplication.run(AnimePlayApplication.class, args);
        System.out.println("==========Successfully Running Anime Play Application==========");
    }
}

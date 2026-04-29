package com.backend.animeplay.configuration;

import com.backend.animeplay.entity.User;
import com.backend.animeplay.enums.RoleEnum;
import com.backend.animeplay.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationInitConfig {
    final UserRepository userRepository;
    final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    String adminUsername;

    @Value("${app.admin.password:admin}")
    String adminPassword;

    @Value("${app.admin.email:admin@gmail.com}")
    String adminEmail;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            if (userRepository.existsByUsername(adminUsername) || userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .fullName("Administrator")
                    .password(passwordEncoder.encode(adminPassword))
                    .role(RoleEnum.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin account created: {}", adminUsername);
        };
    }
}

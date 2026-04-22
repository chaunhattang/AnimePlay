package com.backend.animeplay.repository;

import com.backend.animeplay.entity.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Long> {
    Optional<ForgotPassword> findByOtpAndUserId(Integer otp, String UserId);

    Optional<ForgotPassword> findByResetToken(String resetToken);

    @Transactional
    void deleteByExpirationTimeBefore(Date currentTime);
}

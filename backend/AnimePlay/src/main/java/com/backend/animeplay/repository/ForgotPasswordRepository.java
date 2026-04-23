package com.backend.animeplay.repository;

import com.backend.animeplay.entity.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, Integer> {
    Optional<ForgotPassword> findByOtpAndUser_Id(Integer otp, String userId);

    Optional<ForgotPassword> findByResetToken(String resetToken);

    @Transactional
    void deleteByExpirationTimeBefore(Date currentTime);
}

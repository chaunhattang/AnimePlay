package com.backend.animeplay.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForgotPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = true)
    Integer otp;

    @Column(nullable = false)
    Date expirationTime;

    @Column(unique = true)
    String resetToken;

    @OneToOne
    User user;
}

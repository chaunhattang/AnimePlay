package com.backend.animeplay.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    @NotBlank(message = "ACCOUNT_INVALID")
    String accountName;

    @NotBlank(message = "PASSWORD_INVALID")
    String password;
}

package com.backend.animeplay.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePasswordRequest {
    @NotBlank(message = "INVALID_REQUEST")
    String resetToken;

    @NotBlank(message = "PASSWORD_INVALID")
    @Size(min = 6, max = 100, message = "PASSWORD_INVALID")
    String newPassword;
}

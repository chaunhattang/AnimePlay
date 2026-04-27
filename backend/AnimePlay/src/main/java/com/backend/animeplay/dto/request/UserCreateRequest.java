package com.backend.animeplay.dto.request;

import com.backend.animeplay.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRequest {
    @NotBlank(message = "USERNAME_INVALID")
    @Size(min = 3, max = 50, message = "USERNAME_INVALID")
    String username;

    @NotBlank(message = "PASSWORD_INVALID")
    @Size(min = 6, max = 100, message = "PASSWORD_INVALID")
    String password;

    @NotBlank(message = "EMAIL_INVALID")
    @Email(message = "EMAIL_INVALID")
    String email;

    @Size(max = 100, message = "FULL_NAME_INVALID")
    String fullName;

    @Size(max = 2000, message = "AVATAR_URL_INVALID")
    String avatarUrl;

    @Builder.Default
    @Pattern(regexp = "ADMIN|USER", message = "ROLE_INVALID")
    String role = RoleEnum.USER.name();
}

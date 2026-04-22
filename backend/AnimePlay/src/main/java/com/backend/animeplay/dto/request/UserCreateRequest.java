package com.backend.animeplay.dto.request;

import com.backend.animeplay.enums.RoleEnum;
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
    @Size(min = 3, message = "USERNAME_INVALID")
    String username;

    @Size(min = 6, message = "PASSWORD_INVALID")
    String password;

    String email;

    @Builder.Default
    String role = RoleEnum.USER.name();
}

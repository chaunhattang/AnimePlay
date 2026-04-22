package com.backend.animeplay.dto.response;

import com.backend.animeplay.enums.RoleEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String email;
    String fullName;
    String avatarUrl;
    RoleEnum role;
}

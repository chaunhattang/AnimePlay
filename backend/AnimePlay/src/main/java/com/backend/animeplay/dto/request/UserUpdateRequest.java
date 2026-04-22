package com.backend.animeplay.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String oldPassword;
    String newPassword;
    String fullName;
    String avatarUrl;
}

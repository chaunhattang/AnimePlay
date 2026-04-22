package com.backend.animeplay.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoogleLoginRequest {
    String token;
}
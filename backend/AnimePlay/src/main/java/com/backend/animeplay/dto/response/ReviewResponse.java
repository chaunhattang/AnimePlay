package com.backend.animeplay.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    Integer id;
    Integer animeId;
    String userId;
    String username;
    String avatarUrl;
    Integer rating;
    String content;
    LocalDateTime createdAt;
}

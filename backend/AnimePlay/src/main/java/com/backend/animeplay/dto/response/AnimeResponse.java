package com.backend.animeplay.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnimeResponse {
    String id;
    String title;
    String description;
    String posterUrl;
    String year;
    String genre;
}

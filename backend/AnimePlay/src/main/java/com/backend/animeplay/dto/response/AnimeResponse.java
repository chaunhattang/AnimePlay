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
    Integer id;
    String title;
    String description;
    String year;
    String genre;
    String posterUrl;
    String trailerUrl;
    Double averageRating;
}

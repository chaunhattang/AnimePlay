package com.backend.animeplay.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnimeUpdateRequest {
    @Size(max = 255, message = "TITLE_INVALID")
    String title;

    String description;

    String year;

    String genre;

    String posterUrl;

    @Size(max = 1000, message = "TRAILER_URL_INVALID")
    String trailerUrl;
}

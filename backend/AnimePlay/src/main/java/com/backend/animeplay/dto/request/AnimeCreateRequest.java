package com.backend.animeplay.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnimeCreateRequest {
    @NotBlank(message = "TITLE_INVALID")
    @Size(max = 255, message = "TITLE_INVALID")
    String title;

    @NotBlank(message = "DESCRIPTION_INVALID")
    String description;

    @NotBlank(message = "YEAR_INVALID")
    String year;

    @NotBlank(message = "GENRE_INVALID")
    String genre;

    String posterUrl;

    @Size(max = 1000, message = "TRAILER_URL_INVALID")
    String trailerUrl;
}

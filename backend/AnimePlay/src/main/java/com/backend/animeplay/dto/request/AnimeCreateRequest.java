package com.backend.animeplay.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AnimeCreateRequest {
    String title;
    String description;
    String year;
    String genre;
    //    String posterUrl;
}

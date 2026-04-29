package com.backend.animeplay.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeResponse {
    Integer id;

    Integer animeId;

    Integer episodeNumber;

    String name;

    String videoUrl;
}

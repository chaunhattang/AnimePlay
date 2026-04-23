package com.backend.animeplay.dto.request;

import com.backend.animeplay.enums.VideoEnum;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeUpdateRequest {
    Integer animeId;

    Integer episodeNumber;

    String videoUrl;

    VideoEnum videoType;
}

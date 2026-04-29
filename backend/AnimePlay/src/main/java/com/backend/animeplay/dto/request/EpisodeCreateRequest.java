package com.backend.animeplay.dto.request;

import com.backend.animeplay.enums.VideoEnum;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeCreateRequest {
    @NotNull(message = "ANIME_ID_REQUIRED")
    Integer animeId;

    @NotNull(message = "EPISODE_NUMBER_REQUIRED")
    @Positive(message = "EPISODE_NUMBER_INVALID")
    Integer episodeNumber;

    String name;

    String videoUrl;

    @NotNull(message = "VIDEO_TYPE_REQUIRED")
    VideoEnum videoType;
}

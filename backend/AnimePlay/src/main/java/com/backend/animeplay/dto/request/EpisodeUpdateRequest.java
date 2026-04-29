package com.backend.animeplay.dto.request;

import com.backend.animeplay.enums.VideoEnum;
import jakarta.validation.constraints.Positive;
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

    @Positive(message = "EPISODE_NUMBER_INVALID")
    Integer episodeNumber;

    String name;

    String videoUrl;

    VideoEnum videoType;
}

package com.backend.animeplay.mapper;

import com.backend.animeplay.dto.request.EpisodeCreateRequest;
import com.backend.animeplay.dto.request.EpisodeUpdateRequest;
import com.backend.animeplay.dto.response.EpisodeResponse;
import com.backend.animeplay.entity.Episode;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface EpisodeMapper {
    Episode toEpisode(EpisodeCreateRequest request);

    @Mapping(source = "anime.id", target = "animeId")
    EpisodeResponse toEpisodeResponse(Episode episode);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEpisode(@MappingTarget Episode episode, EpisodeUpdateRequest request);
}

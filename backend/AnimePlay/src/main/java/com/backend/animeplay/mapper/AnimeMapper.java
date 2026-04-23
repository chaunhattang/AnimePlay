package com.backend.animeplay.mapper;

import com.backend.animeplay.dto.request.AnimeCreateRequest;
import com.backend.animeplay.dto.request.AnimeUpdateRequest;
import com.backend.animeplay.dto.response.AnimeResponse;
import com.backend.animeplay.entity.Anime;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AnimeMapper {
    Anime toAnime(AnimeCreateRequest request);

    AnimeResponse toAnimeResponse(Anime anime);

    @Mapping(target = "posterUrl", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateAnime(@MappingTarget Anime anime, AnimeUpdateRequest request);
}

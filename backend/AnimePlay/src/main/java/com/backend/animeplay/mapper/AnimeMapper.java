package com.backend.animeplay.mapper;

import com.backend.animeplay.dto.request.AnimeCreateRequest;
import com.backend.animeplay.dto.response.AnimeResponse;
import com.backend.animeplay.entity.Anime;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AnimeMapper {
    Anime toAnime(AnimeCreateRequest request);

    AnimeResponse toAnimeResponse(Anime anime);

}

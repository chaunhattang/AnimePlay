package com.backend.animeplay.mapper;

import com.backend.animeplay.dto.response.FavoriteResponse;
import com.backend.animeplay.entity.Favorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FavoriteMapper {
    @Mapping(target = "anime", ignore = true)
    FavoriteResponse toFavoriteResponse(Favorite favorite);
}
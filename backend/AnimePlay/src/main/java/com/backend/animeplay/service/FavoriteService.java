package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.FavoriteRequest;
import com.backend.animeplay.dto.response.FavoriteResponse;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.entity.Favorite;
import com.backend.animeplay.entity.User;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.FavoriteMapper;
import com.backend.animeplay.repository.AnimeRepository;
import com.backend.animeplay.repository.FavoriteRepository;
import com.backend.animeplay.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteService {
    FavoriteRepository favoriteRepository;
    UserRepository userRepository;
    AnimeRepository animeRepository;
    FavoriteMapper favoriteMapper;
    AnimeService animeService;

    @Transactional
    public FavoriteResponse addFavorite(FavoriteRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Anime anime = animeRepository.findById(request.getAnimeId())
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        if (favoriteRepository.existsByUser_IdAndAnime_Id(userId, request.getAnimeId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .anime(anime)
                .build();

        favorite = favoriteRepository.save(favorite);

        FavoriteResponse response = favoriteMapper.toFavoriteResponse(favorite);
        response.setAnime(animeService.getAnimeById(anime.getId()));
        return response;
    }


    public List<FavoriteResponse> getAllFavorites() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        return favoriteRepository.findAllByUser_Id(userId).stream()
                .map(favorite -> {
                    FavoriteResponse res = favoriteMapper.toFavoriteResponse(favorite);
                    res.setAnime(animeService.getAnimeById(favorite.getAnime().getId()));
                    return res;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public String deleteFavoriteById(Integer animeId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!favoriteRepository.existsByUser_IdAndAnime_Id(userId, animeId)) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        favoriteRepository.deleteByUser_IdAndAnime_Id(userId, animeId);
        return "Deleted Favorite Successfully by Anime Id: " + animeId;
    }
}

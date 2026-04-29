package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.FavoriteRequest;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.entity.User;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.FavoriteMapper;
import com.backend.animeplay.repository.AnimeRepository;
import com.backend.animeplay.repository.FavoriteRepository;
import com.backend.animeplay.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AnimeRepository animeRepository;

    @Mock
    private FavoriteMapper favoriteMapper;

    @Mock
    private AnimeService animeService;

    private FavoriteService favoriteService;

    @BeforeEach
    void setUp() {
        favoriteService = new FavoriteService(
                favoriteRepository,
                userRepository,
                animeRepository,
                favoriteMapper,
                animeService
        );

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("user-1");

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void addFavorite_whenAlreadyExists_throwsInvalidRequest() {
        FavoriteRequest request = FavoriteRequest.builder().animeId(11).build();
        User user = User.builder().id("user-1").build();
        Anime anime = Anime.builder().id(11).build();

        when(userRepository.findById("user-1")).thenReturn(Optional.of(user));
        when(animeRepository.findById(11)).thenReturn(Optional.of(anime));
        when(favoriteRepository.existsByUser_IdAndAnime_Id("user-1", 11)).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> favoriteService.addFavorite(request));
        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
    }

    @Test
    void deleteFavorite_whenFavoriteMissing_throwsInvalidRequest() {
        when(favoriteRepository.existsByUser_IdAndAnime_Id("user-1", 11)).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> favoriteService.deleteFavoriteById(11));
        assertEquals(ErrorCode.INVALID_REQUEST, exception.getErrorCode());
        verify(favoriteRepository, never()).deleteByUser_IdAndAnime_Id(anyString(), anyInt());
    }
}

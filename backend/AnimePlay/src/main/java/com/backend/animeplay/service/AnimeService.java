package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.AnimeCreateRequest;
import com.backend.animeplay.dto.request.AnimeUpdateRequest;
import com.backend.animeplay.dto.response.AnimeResponse;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.AnimeMapper;
import com.backend.animeplay.repository.AnimeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnimeService {
    AnimeRepository animeRepository;
    AnimeMapper animeMapper;
    FileStorageService fileStorageService;

    @Transactional
    @CacheEvict(value = {"animeById", "animeSearch"}, allEntries = true)
    public AnimeResponse createAnime(AnimeCreateRequest request, MultipartFile file) {
        Anime anime = animeMapper.toAnime(request);
        if (file != null && !file.isEmpty()) {
            anime.setPosterUrl(fileStorageService.storeImageFile(file));
        }
        return animeMapper.toAnimeResponse(animeRepository.save(anime));
    }

    @Cacheable(value = "animeById", key = "#id")
    public AnimeResponse getAnimeById(Integer id) {
        return animeMapper.toAnimeResponse(animeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND)));
    }

    @Cacheable(value = "animeSearch", key = "T(String).format('%s|%s|%s|%s|%s|%s', #page, #size, #search, #genre, #sortBy, #sortDir)")
    public Page<AnimeResponse> getAnime(int page, int size, String search, String genre, String sortBy, String sortDir) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String safeSortBy = switch (sortBy == null ? "" : sortBy) {
            case "title", "year", "genre", "id" -> sortBy;
            default -> "id";
        };
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, safeSortBy));

        String normalizedSearch = search == null ? "" : search.trim();
        String normalizedGenre = genre == null ? "" : genre.trim();

        return animeRepository.findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCase(
                        normalizedSearch,
                        normalizedGenre,
                        pageable
                )
                .map(animeMapper::toAnimeResponse);
    }

    @Transactional
    @CacheEvict(value = {"animeById", "animeSearch"}, allEntries = true)
    public AnimeResponse updateAnimeById(Integer id, AnimeUpdateRequest request, MultipartFile file) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        animeMapper.updateAnime(anime, request);

        if (file != null && !file.isEmpty()) {
            anime.setPosterUrl(fileStorageService.storeImageFile(file));
        }

        return animeMapper.toAnimeResponse(animeRepository.save(anime));
    }

    @CacheEvict(value = {"animeById", "animeSearch"}, allEntries = true)
    public String deleteAnimeById(Integer id) {
        if (!animeRepository.existsById(id)) {
            throw new AppException(ErrorCode.ANIME_NOT_FOUND);
        }
        animeRepository.deleteById(id);
        return "Successfully deleted anime by Anime Id: " + id;
    }
}

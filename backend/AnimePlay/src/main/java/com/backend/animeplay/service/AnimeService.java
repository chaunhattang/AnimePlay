package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.AnimeCreateRequest;
import com.backend.animeplay.dto.request.AnimeUpdateRequest;
import com.backend.animeplay.dto.response.AnimeResponse;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.AnimeMapper;
import com.backend.animeplay.repository.AnimeRepository;
import com.backend.animeplay.repository.ReviewRepository;
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
    ReviewRepository reviewRepository;
    com.backend.animeplay.repository.EpisodeRepository episodeRepository;
    com.backend.animeplay.repository.FavoriteRepository favoriteRepository;

    @Transactional
    @CacheEvict(value = { "animeById", "animeSearch" }, allEntries = true)
    public AnimeResponse createAnime(AnimeCreateRequest request, MultipartFile file) {
        Anime anime = animeMapper.toAnime(request);
        if (file != null && !file.isEmpty()) {
            anime.setPosterUrl(fileStorageService.storeImageFile(file));
        }
        return animeMapper.toAnimeResponse(animeRepository.save(anime));
    }

    @Cacheable(value = "animeById", key = "#id")
    public AnimeResponse getAnimeById(Integer id) {
        Anime anime = animeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));
        AnimeResponse resp = animeMapper.toAnimeResponse(anime);
        resp.setAverageRating(computeAverageRating(anime.getId()));
        return resp;
    }

    @Cacheable(value = "animeSearch", key = "T(String).format('%s|%s|%s|%s|%s|%s', #page, #size, #search, #genre, #sortBy, #sortDir)")
    public Page<AnimeResponse> getAnime(int page, int size, String search, String genre, String sortBy,
            String sortDir) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String safeSortBy = switch (sortBy == null ? "" : sortBy) {
            case "title", "year", "genre", "id" -> sortBy;
            default -> "id";
        };
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, safeSortBy));

        String normalizedSearch = search == null ? "" : search.trim();
        String normalizedGenre = genre == null ? "" : genre.trim();

        Page<AnimeResponse> pageResult = animeRepository.findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCase(
                normalizedSearch,
                normalizedGenre,
                pageable)
                .map(animeMapper::toAnimeResponse);

        // enrich with average rating
        return pageResult.map(ar -> {
            ar.setAverageRating(computeAverageRating(ar.getId()));
            return ar;
        });
    }

    private Double computeAverageRating(Integer animeId) {
        var list = reviewRepository.findByAnime_IdOrderByCreatedAtDesc(animeId);
        if (list == null || list.isEmpty())
            return 0.0;
        double sum = 0.0;
        int count = 0;
        for (var r : list) {
            if (r.getRating() != null) {
                sum += r.getRating();
                count++;
            }
        }
        return count == 0 ? 0.0 : sum / count;
    }

    @Transactional
    @CacheEvict(value = { "animeById", "animeSearch" }, allEntries = true)
    public AnimeResponse updateAnimeById(Integer id, AnimeUpdateRequest request, MultipartFile file) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        animeMapper.updateAnime(anime, request);

        if (file != null && !file.isEmpty()) {
            anime.setPosterUrl(fileStorageService.storeImageFile(file));
        }

        return animeMapper.toAnimeResponse(animeRepository.save(anime));
    }

    @Transactional
    @CacheEvict(value = { "animeById", "animeSearch" }, allEntries = true)
    public String deleteAnimeById(Integer id) {
        if (!animeRepository.existsById(id)) {
            throw new AppException(ErrorCode.ANIME_NOT_FOUND);
        }
        // Delete favorites that reference this anime first (avoid FK errors)
        try {
            favoriteRepository.deleteByAnimeId(id);
        } catch (Exception ex) {
            log.warn("Failed to delete favorites for anime {}: {}", id, ex.getMessage());
        }

        // Delete episodes that reference this anime to avoid FK constraint errors
        try {
            episodeRepository.deleteByAnimeId(id);
        } catch (Exception ex) {
            log.warn("Failed to delete episodes for anime {}: {}", id, ex.getMessage());
        }

        // Clear anime references from reviews so comments remain (anonymized)
        try {
            reviewRepository.clearAnimeFromReviews(id);
        } catch (Exception ex) {
            log.warn("Failed to clear anime references from reviews for anime {}: {}", id, ex.getMessage());
        }

        animeRepository.deleteById(id);
        return "Successfully deleted anime by Anime Id: " + id;
    }
}

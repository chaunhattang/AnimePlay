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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnimeService {
    AnimeRepository animeRepository;
    AnimeMapper animeMapper;
    CloudinaryService cloudinaryService;

    public AnimeResponse createAnime(AnimeCreateRequest request, MultipartFile file) {
        Anime anime = animeMapper.toAnime(request);
        if (file != null && !file.isEmpty()) {
            String fileName = cloudinaryService.uploadImage(file);
            if (fileName != null) {
                anime.setPosterUrl(fileName);
            }
        }
        return animeMapper.toAnimeResponse(animeRepository.save(anime));
    }

    public AnimeResponse getAnimeById(Integer id) {
        return animeMapper.toAnimeResponse(animeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND)));
    }

    public List<AnimeResponse> getAnimeList() {
        return animeRepository.findAll().stream()
                .map(animeMapper::toAnimeResponse)
                .collect(Collectors.toList());
    }

    private void updateIfPresent(String value, Consumer<String> setter) {
        if (value != null && !value.trim().isEmpty()) {
            setter.accept(value);
        }
    }

    public AnimeResponse updateAnimeById(Integer id, AnimeUpdateRequest request, MultipartFile file) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        updateIfPresent(request.getTitle(), anime::setTitle);
        updateIfPresent(request.getDescription(), anime::setDescription);
        updateIfPresent(request.getYear(), anime::setYear);
        updateIfPresent(request.getGenre(), anime::setGenre);

        if (file != null && !file.isEmpty()) {
            String fileName = cloudinaryService.uploadImage(file);
            if (fileName != null) {
                anime.setPosterUrl(fileName);
            }
        }

        return animeMapper.toAnimeResponse(animeRepository.save(anime));
    }

    public String deleteAnimeById(Integer id) {
        animeRepository.deleteById(id);
        return "Successfully deleted anime";
    }
}

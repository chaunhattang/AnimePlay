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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    CloudinaryService cloudinaryService;

    @Transactional
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

    public Page<AnimeResponse> getAllAnime(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return animeRepository.findAll(pageable)
                .map(animeMapper::toAnimeResponse);
    }

//    private void updateIfPresent(String value, Consumer<String> setter) {
//        if (value != null && !value.trim().isEmpty()) {
//            setter.accept(value);
//        }
//    }

    @Transactional
    public AnimeResponse updateAnimeById(Integer id, AnimeUpdateRequest request, MultipartFile file) {
        Anime anime = animeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        animeMapper.updateAnime(anime, request);
//        updateIfPresent(request.getTitle(), anime::setTitle);
//        updateIfPresent(request.getDescription(), anime::setDescription);
//        updateIfPresent(request.getYear(), anime::setYear);
//        updateIfPresent(request.getGenre(), anime::setGenre);

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
        return "Successfully deleted anime by Anime Id: " + id;
    }
}

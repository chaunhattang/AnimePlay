package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.EpisodeCreateRequest;
import com.backend.animeplay.dto.request.EpisodeUpdateRequest;
import com.backend.animeplay.dto.response.EpisodeResponse;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.entity.Episode;
import com.backend.animeplay.enums.VideoEnum;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.EpisodeMapper;
import com.backend.animeplay.repository.AnimeRepository;
import com.backend.animeplay.repository.EpisodeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EpisodeService {
    EpisodeRepository episodeRepository;
    AnimeRepository animeRepository;
    EpisodeMapper episodeMapper;
    FileStorageService fileStorageService;

    @Transactional
    public EpisodeResponse createEpisode(EpisodeCreateRequest request, MultipartFile file) {
        Episode episode = episodeMapper.toEpisode(request);
        Anime anime = animeRepository.findById(request.getAnimeId())
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));
        episode.setAnime(anime);

        if (request.getVideoType() == VideoEnum.LOCAL) {
            if (file != null && !file.isEmpty()) {
                episode.setVideoUrl(fileStorageService.storeVideoFile(file));
            } else {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        } else {
            if (request.getVideoUrl() == null || request.getVideoUrl().isEmpty()) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        return episodeMapper.toEpisodeResponse(episodeRepository.save(episode));
    }

    @Transactional
    public EpisodeResponse updateEpisodeById(Integer id, EpisodeUpdateRequest request, MultipartFile file) {
        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND));

        if (request.getEpisodeNumber() != null) {
            episode.setEpisodeNumber(request.getEpisodeNumber());
        }
        if (request.getName() != null) {
            episode.setName(request.getName());
        }
        if (request.getAnimeId() != null) {
            Anime anime = animeRepository.findById(request.getAnimeId())
                    .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));
            episode.setAnime(anime);
        }

        if (request.getVideoType() == VideoEnum.LOCAL) {
            if (file != null && !file.isEmpty()) {
                episode.setVideoUrl(fileStorageService.storeVideoFile(file));
            }
        } else if (request.getVideoType() != null) {
            if (request.getVideoUrl() != null) {
                episode.setVideoUrl(request.getVideoUrl());
            }
        }

        return episodeMapper.toEpisodeResponse(episodeRepository.save(episode));
    }

    public EpisodeResponse getEpisodeById(Integer id) {
        return episodeMapper.toEpisodeResponse(episodeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND)));
    }

    public List<EpisodeResponse> getAllEpisodes() {
        return episodeRepository.findAll().stream()
                .map(episodeMapper::toEpisodeResponse)
                .collect(Collectors.toList());
    }

    public List<EpisodeResponse> getEpisodesByAnimeId(Integer animeId) {
        return episodeRepository.findByAnimeIdOrderByEpisodeNumberAsc(animeId).stream()
                .map(episodeMapper::toEpisodeResponse)
                .collect(Collectors.toList());
    }

    public String deleteEpisodeById(Integer id) {
        if (!episodeRepository.existsById(id)) {
            throw new AppException(ErrorCode.EPISODE_NOT_FOUND);
        }
        episodeRepository.deleteById(id);
        return "Successfully deleted episode by: " + id;
    }
}

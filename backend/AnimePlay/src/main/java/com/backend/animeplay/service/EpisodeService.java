package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.EpisodeCreateRequest;
import com.backend.animeplay.dto.request.EpisodeUpdateRequest;
import com.backend.animeplay.dto.response.EpisodeResponse;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.entity.Episode;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.EpisodeMapper;
import com.backend.animeplay.repository.AnimeRepository;
import com.backend.animeplay.repository.EpisodeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EpisodeService {
    EpisodeRepository episodeRepository;
    EpisodeMapper episodeMapper;
    AnimeRepository animeRepository;

    @Transactional
    public EpisodeResponse createEpisode(EpisodeCreateRequest request) {
        Anime anime = animeRepository.findById(request.getAnimeId())
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        Episode episode = episodeMapper.toEpisode(request);
        episode.setAnime(anime);

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


    @Transactional
    public EpisodeResponse updateEpisodeById(Integer id, EpisodeUpdateRequest request) {
        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EPISODE_NOT_FOUND));

        episodeMapper.updateEpisode(episode, request);

        return episodeMapper.toEpisodeResponse(episodeRepository.save(episode));
    }

    public String deleteEpisodeById(Integer id) {
        episodeRepository.deleteById(id);
        return "Successfully deleted episode by Episode Id: " + id;
    }
}

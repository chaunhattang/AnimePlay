package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EpisodeRepository extends JpaRepository<Episode, Integer> {
    List<Episode> findByAnimeIdOrderByEpisodeNumberAsc(Integer animeId);
}

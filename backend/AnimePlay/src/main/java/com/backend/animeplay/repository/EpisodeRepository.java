package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EpisodeRepository extends JpaRepository<Episode, Integer> {
    List<Episode> findByAnimeIdOrderByEpisodeNumberAsc(Integer animeId);

    @Modifying
    @Transactional
    @Query("delete from Episode e where e.anime.id = :animeId")
    void deleteByAnimeId(@Param("animeId") Integer animeId);
}

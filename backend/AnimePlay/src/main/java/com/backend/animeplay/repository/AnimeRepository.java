package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Anime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnimeRepository extends JpaRepository<Anime, Integer> {
    Optional<Anime> findAnimeById(Integer id);
}

package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Anime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimeRepository extends JpaRepository<Anime, Integer> {
    Page<Anime> findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCase(
            String title,
            String genre,
            Pageable pageable
    );
}

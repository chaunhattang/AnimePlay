package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByAnime_IdOrderByCreatedAtDesc(Integer animeId);
}

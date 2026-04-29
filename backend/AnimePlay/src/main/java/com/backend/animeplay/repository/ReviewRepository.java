package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByAnime_IdOrderByCreatedAtDesc(Integer animeId);

    @Modifying
    @Transactional
    @Query("update Review r set r.user = null where r.user.id = :userId")
    void clearUserFromReviews(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query("update Review r set r.anime = null where r.anime.id = :animeId")
    void clearAnimeFromReviews(@Param("animeId") Integer animeId);
}

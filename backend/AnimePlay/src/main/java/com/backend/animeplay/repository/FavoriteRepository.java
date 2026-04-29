package com.backend.animeplay.repository;

import com.backend.animeplay.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    List<Favorite> findAllByUser_Id(String userId);

    boolean existsByUser_IdAndAnime_Id(String userId, Integer animeId);

    void deleteByUser_IdAndAnime_Id(String userId, Integer animeId);

    @Modifying
    @Transactional
    @Query("delete from Favorite f where f.anime.id = :animeId")
    void deleteByAnimeId(@Param("animeId") Integer animeId);
}
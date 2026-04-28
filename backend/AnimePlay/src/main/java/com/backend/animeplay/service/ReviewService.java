package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.ReviewCreateRequest;
import com.backend.animeplay.dto.response.ReviewResponse;
import com.backend.animeplay.entity.Anime;
import com.backend.animeplay.entity.Review;
import com.backend.animeplay.entity.User;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.ReviewMapper;
import com.backend.animeplay.repository.AnimeRepository;
import com.backend.animeplay.repository.ReviewRepository;
import com.backend.animeplay.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    ReviewRepository reviewRepository;
    UserRepository userRepository;
    AnimeRepository animeRepository;
    ReviewMapper reviewMapper;

    public List<ReviewResponse> getReviewsByAnimeId(Integer animeId) {
        animeRepository.findById(animeId).orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));
        List<Review> list = reviewRepository.findByAnime_IdOrderByCreatedAtDesc(animeId);
        return reviewMapper.toReviewResponseList(list);
    }

    @Transactional
    public ReviewResponse createReview(ReviewCreateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Anime anime = animeRepository.findById(request.getAnimeId())
                .orElseThrow(() -> new AppException(ErrorCode.ANIME_NOT_FOUND));

        Review review = Review.builder()
                .anime(anime)
                .user(user)
                .content(request.getContent())
                .rating(request.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        review = reviewRepository.save(review);
        return reviewMapper.toReviewResponse(review);
    }
}

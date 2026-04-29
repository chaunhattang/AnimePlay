package com.backend.animeplay.mapper;

import com.backend.animeplay.dto.response.ReviewResponse;
import com.backend.animeplay.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(source = "anime.id", target = "animeId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.avatarUrl", target = "avatarUrl")
    ReviewResponse toReviewResponse(Review review);

    List<ReviewResponse> toReviewResponseList(List<Review> reviews);
}

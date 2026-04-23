package com.backend.animeplay.controller;

import com.backend.animeplay.dto.request.FavoriteRequest;
import com.backend.animeplay.dto.response.ApiResponse;
import com.backend.animeplay.dto.response.FavoriteResponse;
import com.backend.animeplay.service.FavoriteService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteController {
    FavoriteService favoriteService;

    @PostMapping
    public ApiResponse<FavoriteResponse> addFavorite(@RequestBody FavoriteRequest request) {
        return ApiResponse.<FavoriteResponse>builder()
                .result(favoriteService.addFavorite(request))
                .message("Added Favorite Successfully")
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<FavoriteResponse>> getMyFavorites() {
        return ApiResponse.<List<FavoriteResponse>>builder()
                .result(favoriteService.getAllFavorites())
                .message("Got All Favorites Successfully")
                .build();
    }

    @DeleteMapping("/{animeId}")
    public ApiResponse<String> removeFavorite(@PathVariable("animeId") Integer animeId) {
        return ApiResponse.<String>builder()
                .result(favoriteService.deleteFavoriteById(animeId))
                .message("Deleted Favorite Successfully")
                .build();
    }
}
package com.backend.animeplay.controller;

import com.backend.animeplay.dto.request.AnimeCreateRequest;
import com.backend.animeplay.dto.request.AnimeUpdateRequest;
import com.backend.animeplay.dto.response.AnimeResponse;
import com.backend.animeplay.dto.response.ApiResponse;
import com.backend.animeplay.service.AnimeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/anime")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnimeController {
    AnimeService animeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AnimeResponse> createAnime(
            @ModelAttribute @Valid AnimeCreateRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ApiResponse.<AnimeResponse>builder()
                .result(animeService.createAnime(request, file))
                .message("Created Anime Successfully")
                .build();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<AnimeResponse>> getAllAnime(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<AnimeResponse>>builder()
                .result(animeService.getAllAnime(page, size))
                .message("All Anime Got Successfully")
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<AnimeResponse> getAnimeById(@PathVariable("id") Integer id) {
        return ApiResponse.<AnimeResponse>builder()
                .result(animeService.getAnimeById(id))
                .message("Anime Got Successfully")
                .build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AnimeResponse> updateAnimeById(
            @PathVariable("id") Integer id,
            @ModelAttribute AnimeUpdateRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ApiResponse.<AnimeResponse>builder()
                .result(animeService.updateAnimeById(id, request, file))
                .message("Updated Anime Successfully")
                .build();
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteAnime(@PathVariable("id") Integer id) {
        return ApiResponse.<String>builder()
                .result(animeService.deleteAnimeById(id))
                .message("Anime Deleted Successfully")
                .build();
    }
}

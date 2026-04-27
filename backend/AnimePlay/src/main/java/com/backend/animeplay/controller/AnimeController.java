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
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;

@Slf4j
@RestController
@RequestMapping("/anime")
@Validated
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AnimeController {
    AnimeService animeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AnimeResponse> createAnime(
            @ModelAttribute @Valid AnimeCreateRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ApiResponse.<AnimeResponse>builder()
                .code(201)
                .result(animeService.createAnime(request, file))
                .message("Created Anime Successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<Page<AnimeResponse>> getAnime(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String genre,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ApiResponse.<Page<AnimeResponse>>builder()
                .result(animeService.getAnime(page, size, search, genre, sortBy, sortDir))
                .message("All Anime Got Successfully")
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<Page<AnimeResponse>> getAllAnime(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String genre,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return getAnime(page, size, search, genre, sortBy, sortDir);
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
            @ModelAttribute @Valid AnimeUpdateRequest request,
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

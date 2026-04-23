package com.backend.animeplay.controller;

import com.backend.animeplay.dto.request.EpisodeCreateRequest;
import com.backend.animeplay.dto.request.EpisodeUpdateRequest;
import com.backend.animeplay.dto.response.ApiResponse;
import com.backend.animeplay.dto.response.EpisodeResponse;
import com.backend.animeplay.service.EpisodeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/episodes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EpisodeServiceController {
    EpisodeService episodeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<EpisodeResponse> createEpisode(
            @ModelAttribute @Valid EpisodeCreateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.createEpisode(request, file))
                .message("Created Episode Successfully")
                .build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<EpisodeResponse> updateEpisodeById(
            @PathVariable("id") Integer id,
            @ModelAttribute EpisodeUpdateRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.updateEpisodeById(id, request, file))
                .message("Updated Episodes Successfully")
                .build();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<EpisodeResponse>> getAllEpisodes() {
        return ApiResponse.<List<EpisodeResponse>>builder()
                .result(episodeService.getAllEpisodes())
                .message("All Episodes Got Successfully")
                .build();
    }

    @GetMapping(value = "/{id}")
    public ApiResponse<EpisodeResponse> getEpisodeById(@PathVariable("id") Integer id) {
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.getEpisodeById(id))
                .message("Episodes Got Successfully")
                .build();
    }
    
    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteEpisodes(@PathVariable("id") Integer id) {
        return ApiResponse.<String>builder()
                .result(episodeService.deleteEpisodeById(id))
                .message("Episodes Deleted Successfully")
                .build();
    }
}

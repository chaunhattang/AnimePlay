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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/episodes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EpisodeServiceController {
    EpisodeService episodeService;

    @PostMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<EpisodeResponse> createEpisode(@RequestBody @Valid EpisodeCreateRequest request) {
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.createEpisode(request))
                .message("Created Episode Successfully")
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

    @PutMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<EpisodeResponse> updateEpisodeById(
            @PathVariable("id") Integer id,
            @RequestBody @Valid EpisodeUpdateRequest request
    ) {
        return ApiResponse.<EpisodeResponse>builder()
                .result(episodeService.updateEpisodeById(id, request))
                .message("Updated Episode Successfully")
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

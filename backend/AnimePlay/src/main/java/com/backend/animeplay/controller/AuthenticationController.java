package com.backend.animeplay.controller;

import com.backend.animeplay.dto.request.AuthenticationRequest;
import com.backend.animeplay.dto.request.GoogleLoginRequest;
import com.backend.animeplay.dto.request.UserCreateRequest;
import com.backend.animeplay.dto.response.ApiResponse;
import com.backend.animeplay.dto.response.AuthenticationResponse;
import com.backend.animeplay.dto.response.UserResponse;
import com.backend.animeplay.service.AuthenticationService;
import com.backend.animeplay.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseStatus;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    UserService userService;
    AuthenticationService authenticationService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserResponse> register(@RequestBody @Valid UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(201)
                .result(userService.registerUser(request))
                .message("Register Successfully")
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authenticate(request))
                .message("Login Successfully")
                .build();
    }

    @PostMapping("/google")
    public ApiResponse<AuthenticationResponse> googleLogin(@RequestBody @Valid GoogleLoginRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authenticateWithGoogle(request))
                .message("Google Login Successfully")
                .build();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<UserResponse> create(@RequestBody @Valid UserCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(201)
                .result(userService.createUser(request))
                .message("Create Successfully")
                .build();
    }
}

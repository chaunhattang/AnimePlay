package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.AuthenticationRequest;
import com.backend.animeplay.dto.response.AuthenticationResponse;
import com.backend.animeplay.entity.User;
import com.backend.animeplay.enums.RoleEnum;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        authenticationService = new AuthenticationService(userRepository, passwordEncoder);
        ReflectionTestUtils.setField(authenticationService, "SIGNER_KEY", "01234567890123456789012345678901");
        ReflectionTestUtils.setField(authenticationService, "VALID_DURATION_SECONDS", 3600L);
    }

    @Test
    void authenticate_whenUsernameAndPasswordValid_returnsToken() {
        User user = User.builder()
                .id("user-1")
                .username("demo")
                .password("encoded")
                .role(RoleEnum.USER)
                .build();
        when(userRepository.findByUsername("demo")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded")).thenReturn(true);

        AuthenticationResponse response = authenticationService.authenticate(
                new AuthenticationRequest("demo", "secret123")
        );

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertFalse(response.getToken().isBlank());
    }

    @Test
    void authenticate_whenUserNotFound_throwsUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("unknown")).thenReturn(Optional.empty());

        AppException exception = assertThrows(
                AppException.class,
                () -> authenticationService.authenticate(new AuthenticationRequest("unknown", "secret123"))
        );

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void authenticate_whenPasswordMismatch_throwsWrongPassword() {
        User user = User.builder()
                .id("user-1")
                .username("demo")
                .password("encoded")
                .role(RoleEnum.USER)
                .build();
        when(userRepository.findByUsername("demo")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded")).thenReturn(false);

        AppException exception = assertThrows(
                AppException.class,
                () -> authenticationService.authenticate(new AuthenticationRequest("demo", "wrong-password"))
        );

        assertEquals(ErrorCode.WRONG_PASSWORD, exception.getErrorCode());
    }
}

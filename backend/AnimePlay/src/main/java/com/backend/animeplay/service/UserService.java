package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.UserCreateRequest;
import com.backend.animeplay.dto.request.UserUpdateRequest;
import com.backend.animeplay.dto.response.UserResponse;
import com.backend.animeplay.entity.User;
import com.backend.animeplay.enums.RoleEnum;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.UserMapper;
import com.backend.animeplay.repository.FavoriteRepository;
import com.backend.animeplay.repository.ReviewRepository;
import com.backend.animeplay.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    FileStorageService fileStorageService;
    PasswordEncoder passwordEncoder;
    ReviewRepository reviewRepository;
    FavoriteRepository favoriteRepository;

    public UserResponse registerUser(UserCreateRequest request) {
        return createUser(request, RoleEnum.USER);
    }

    public UserResponse createUser(UserCreateRequest request) {
        return createUser(request, parseRole(request.getRole()));
    }

    private UserResponse createUser(UserCreateRequest request, RoleEnum role) {
        String username = normalize(request.getUsername());
        String email = normalize(request.getEmail()).toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = userMapper.toUser(request);
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(normalizeOrDefault(request.getFullName(), username));
        user.setPassword(passwordEncoder.encode(normalize(request.getPassword())));
        user.setRole(role);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable)
                .map(userMapper::toUserResponse);
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    public UserResponse getCurrentUser() {
        return getUserById(getAuthenticatedUserId());
    }

    @Transactional
    public UserResponse updateCurrentUser(UserUpdateRequest request, MultipartFile file) {
        return updateUserById(getAuthenticatedUserId(), request, file);
    }

    @Transactional
    public UserResponse updateUserById(String id, UserUpdateRequest request, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean isAdmin = isCurrentUserAdmin();
        String authenticatedUserId = getAuthenticatedUserId();
        if (!isAdmin && !authenticatedUserId.equals(id)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (hasText(request.getUsername())) {
            String username = normalize(request.getUsername());
            if (userRepository.existsByUsernameAndIdNot(username, id)) {
                throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
            }
            user.setUsername(username);
        }

        if (hasText(request.getEmail())) {
            String email = normalize(request.getEmail()).toLowerCase();
            if (userRepository.existsByEmailAndIdNot(email, id)) {
                throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(email);
        }

        userMapper.updateUser(user, request);

        if (isAdmin && hasText(request.getRole())) {
            user.setRole(parseRole(request.getRole()));
        }

        if (isAdmin && hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(normalize(request.getPassword())));
        }

        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (!isAdmin) {
                if (request.getOldPassword() == null
                        || request.getOldPassword().trim().isEmpty()
                        || !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                    throw new AppException(ErrorCode.WRONG_PASSWORD);
                }
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        if (hasText(request.getAvatarUrl())) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        if (file != null && !file.isEmpty()) {
            user.setAvatarUrl(fileStorageService.storeImageFile(file));
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public String deleteById(String id) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if (id.equals(getAuthenticatedUserId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        favoriteRepository.deleteByUserId(id);
        reviewRepository.deleteByUserId(id);
        try {
            reviewRepository.clearUserFromReviews(id);
        } catch (Exception ex) {
            log.warn("Failed to clear user references from reviews for user {}: {}", id, ex.getMessage());
        }

        userRepository.deleteById(id);
        return "Deleted User Successfully by User Id: " + id;
    }

    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private boolean isCurrentUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private RoleEnum parseRole(String role) {
        if (!hasText(role)) {
            return RoleEnum.USER;
        }
        try {
            return RoleEnum.valueOf(normalize(role).toUpperCase());
        } catch (Exception ex) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeOrDefault(String value, String defaultValue) {
        String normalized = normalize(value);
        return normalized.isEmpty() ? defaultValue : normalized;
    }
}

package com.backend.animeplay.service;

import com.backend.animeplay.dto.request.UserCreateRequest;
import com.backend.animeplay.dto.request.UserUpdateRequest;
import com.backend.animeplay.dto.response.UserResponse;
import com.backend.animeplay.entity.User;
import com.backend.animeplay.enums.RoleEnum;
import com.backend.animeplay.exception.AppException;
import com.backend.animeplay.exception.ErrorCode;
import com.backend.animeplay.mapper.UserMapper;
import com.backend.animeplay.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    CloudinaryService cloudinaryService;
    PasswordEncoder passwordEncoder;

    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())
                || userRepository.existsByEmail(request.getEmail())
        ) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(RoleEnum.valueOf(request.getRole()));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    // Only Admin
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUserById(String id, UserUpdateRequest request, MultipartFile file) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUser(user, request);
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getOldPassword() == null
                    || request.getOldPassword().trim().isEmpty()
                    || !passwordEncoder.matches(request.getOldPassword(), user.getPassword())
            ) {
                throw new AppException(ErrorCode.WRONG_PASSWORD);
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        if (file != null && !file.isEmpty()) {
            String fileName = cloudinaryService.uploadImage(file);
            if (fileName != null) {
                user.setAvatarUrl(fileName);
            }
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public String deleteById(String id) {
        userRepository.deleteById(id);
        return "Deleted by " + id;
    }
}

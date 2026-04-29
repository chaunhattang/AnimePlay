package com.backend.animeplay.controller;

import com.backend.animeplay.dto.request.UserUpdateRequest;
import com.backend.animeplay.dto.response.ApiResponse;
import com.backend.animeplay.dto.response.UserResponse;
import com.backend.animeplay.service.UserService;
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
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<Page<UserResponse>>builder()
                .result(userService.getAllUsers(page, size))
                .message("All Users Got Successfully")
                .build();
    }

    @GetMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.name")
    public ApiResponse<UserResponse> getUser(@PathVariable("id") String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserById(id))
                .message("User Got Successfully")
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getCurrentUser())
                .message("Current User Got Successfully")
                .build();
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UserResponse> updateCurrentUser(
            @ModelAttribute @Valid UserUpdateRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateCurrentUser(request, file))
                .message("Current User Updated Successfully")
                .build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.name")
    public ApiResponse<UserResponse> updateUserByUsername(
            @PathVariable("id") String id,
            @ModelAttribute @Valid UserUpdateRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUserById(id, request, file))
                .message("User Updated Successfully")
                .build();
    }

    @DeleteMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteUser(@PathVariable("id") String id) {
        return ApiResponse.<String>builder()
                .result(userService.deleteById(id))
                .message("User Deleted Successfully")
                .build();
    }

    @GetMapping("/test-file")
    public String testFile() {
        // Lấy đúng tên file mà lúc nãy trình duyệt báo lỗi
        String fileName = "c59e8ee5-b485-4ee2-8ff9-02bd2957e749_anh-cho-cute-de-thuong.jpg";

        java.io.File file = new java.io.File("uploads/images/" + fileName);

        return "<h1>Kết quả kiểm tra:</h1>" +
                "<p>Đường dẫn thư mục Spring Boot đang tìm kiếm là: <b>" + file.getAbsolutePath() + "</b></p>" +
                "<p>File này có thực sự tồn tại ở đó không? : <b>" + (file.exists() ? "CÓ TỒN TẠI ✅" : "KHÔNG TỒN TẠI ❌") + "</b></p>";
    }
}

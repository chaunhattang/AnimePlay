package com.backend.animeplay.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(8888, "Unrecognized message key", HttpStatus.BAD_REQUEST),

    USERNAME_INVALID(1001, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1002, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email is invalid", HttpStatus.BAD_REQUEST),
    FULL_NAME_INVALID(1004, "Full name is invalid", HttpStatus.BAD_REQUEST),
    ROLE_INVALID(1005, "Role must be ADMIN or USER", HttpStatus.BAD_REQUEST),
    AVATAR_URL_INVALID(1006, "Avatar URL is invalid", HttpStatus.BAD_REQUEST),
    ACCOUNT_INVALID(1007, "Account name is required", HttpStatus.BAD_REQUEST),
    GOOGLE_TOKEN_INVALID(1008, "Google token is required", HttpStatus.BAD_REQUEST),
    TITLE_INVALID(1009, "Title is required", HttpStatus.BAD_REQUEST),
    DESCRIPTION_INVALID(1010, "Description is required", HttpStatus.BAD_REQUEST),
    YEAR_INVALID(1011, "Year is required", HttpStatus.BAD_REQUEST),
    GENRE_INVALID(1012, "Genre is required", HttpStatus.BAD_REQUEST),
    TRAILER_URL_INVALID(1013, "Trailer URL is invalid", HttpStatus.BAD_REQUEST),
    EPISODE_NUMBER_REQUIRED(1014, "Episode number is required", HttpStatus.BAD_REQUEST),
    EPISODE_NUMBER_INVALID(1015, "Episode number must be greater than 0", HttpStatus.BAD_REQUEST),
    VIDEO_TYPE_REQUIRED(1016, "Video type is required", HttpStatus.BAD_REQUEST),
    ANIME_ID_REQUIRED(1017, "Anime id is required", HttpStatus.BAD_REQUEST),

    USER_ALREADY_EXISTS(2001, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(2002, "User not found", HttpStatus.NOT_FOUND),
    WRONG_PASSWORD(2003, "Wrong password", HttpStatus.FORBIDDEN),

    ERROR_UPLOAD_IMAGE(2005, "Error uploading image", HttpStatus.BAD_REQUEST),
    WRONG_OTP(2006, "Wrong OTP", HttpStatus.BAD_REQUEST),
    EXPIRED_OTP(2007, "OTP expired", HttpStatus.BAD_REQUEST),
    EXPIRED_PASSWORD(2008, "Password expired", HttpStatus.BAD_REQUEST),

    UNAUTHENTICATED(3001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(3002, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_TOKEN(3003, "Invalid or expired token", HttpStatus.UNAUTHORIZED),
    INVALID_REQUEST(3004, "Invalid request", HttpStatus.BAD_REQUEST),

    ANIME_NOT_FOUND(4001, "Anime not found", HttpStatus.NOT_FOUND),
    EPISODE_NOT_FOUND(4002, "Episode not found", HttpStatus.NOT_FOUND),
    ;

    int code;
    String message;
    HttpStatusCode httpStatusCode;

    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }
}

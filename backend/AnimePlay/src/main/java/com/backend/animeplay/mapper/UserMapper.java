package com.backend.animeplay.mapper;

import com.backend.animeplay.dto.request.UserCreateRequest;
import com.backend.animeplay.dto.request.UserUpdateRequest;
import com.backend.animeplay.dto.response.UserResponse;
import com.backend.animeplay.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreateRequest request);

    UserResponse toUserResponse(User user);
    
    @Mapping(target = "avatarUrl", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

package com.liberate.auth.service;

import com.liberate.auth.dto.response.UserResponse;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.security.UserPrincipal;

public interface UserService {
    UserResponse getCurrentUserProfile(UserPrincipal principal);
    UserResponse updateUserRole(UserPrincipal principal, UserRole newRole);
}

package com.liberate.auth.dto.response;

import com.liberate.auth.entity.AuthProvider;
import com.liberate.auth.entity.User;
import com.liberate.auth.entity.UserRole;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class UserResponse {

    private String id;
    private String name;
    private String email;
    private UserRole role;
    private boolean emailVerified;
    private List<AuthProvider> providers;
    private String avatarUrl;
    private Instant createdAt;

    public UserResponse() {}

    public static UserResponse fromEntity(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getNombre());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setEmailVerified(user.isEmailVerificado());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());
        if (user.getIdentities() != null) {
            dto.setProviders(user.getIdentities().stream()
                    .map(i -> i.getProvider())
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public List<AuthProvider> getProviders() {
        return providers;
    }

    public void setProviders(List<AuthProvider> providers) {
        this.providers = providers;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

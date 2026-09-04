package com.liberate.auth.dto.request;

import com.liberate.auth.entity.UserRole;
import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {

    @NotBlank(message = "El ID Token de Google es requerido")
    private String idToken;

    private UserRole role;

    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String idToken, UserRole role) {
        this.idToken = idToken;
        this.role = role;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}

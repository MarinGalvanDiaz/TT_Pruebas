package com.liberate.auth.service;

import com.liberate.auth.dto.request.*;
import com.liberate.auth.dto.response.ApiResponse;
import com.liberate.auth.dto.response.AuthResponse;
import com.liberate.auth.security.UserPrincipal;

public interface AuthService {
    AuthResponse register(RegisterRequest request, String clientIp);
    AuthResponse login(LoginRequest request, String clientIp);
    AuthResponse loginWithGoogle(GoogleLoginRequest request, String clientIp);
    AuthResponse refreshToken(RefreshTokenRequest request);
    ApiResponse<Void> forgotPassword(ForgotPasswordRequest request, String clientIp);
    ApiResponse<Void> resetPassword(ResetPasswordRequest request);
    ApiResponse<Void> verifyEmail(VerifyEmailRequest request);
    void logout(String rawRefreshToken);
    void logoutAll(UserPrincipal userPrincipal);
}

package com.liberate.auth.service;

import com.liberate.auth.entity.RefreshToken;
import com.liberate.auth.entity.User;

public interface TokenService {
    String generateRawToken();
    String generateVerificationCode();
    String hashToken(String rawToken);
    RefreshToken createRefreshToken(User user);
    RefreshToken verifyAndRotateRefreshToken(String rawRefreshToken);
    void revokeRefreshToken(String rawRefreshToken);
    void revokeAllUserTokens(User user);
}

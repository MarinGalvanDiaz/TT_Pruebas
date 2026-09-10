package com.liberate.auth.service;

import com.liberate.auth.config.JwtProperties;
import com.liberate.auth.entity.RefreshToken;
import com.liberate.auth.entity.User;
import com.liberate.auth.exception.InvalidTokenException;
import com.liberate.auth.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class TokenServiceImpl implements TokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public TokenServiceImpl(RefreshTokenRepository refreshTokenRepository, JwtProperties jwtProperties) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtProperties = jwtProperties;
    }

    @Override
    public String generateRawToken() {
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    @Override
    public String generateVerificationCode() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

    @Override
    public String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        String rawToken = generateRawToken();
        String tokenHash = hashToken(rawToken);

        Instant expiryDate = Instant.now().plusMillis(jwtProperties.getRefreshTokenExpirationMs());
        RefreshToken refreshToken = new RefreshToken(tokenHash, user, expiryDate);

        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        // Temporarily store raw token in transient field or return DTO wrapper
        // The calling service receives the raw token for client delivery
        return saved;
    }

    @Override
    @Transactional
    public RefreshToken verifyAndRotateRefreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);

        RefreshToken token = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Refresh token no encontrado o inválido"));

        if (!token.isValid()) {
            refreshTokenRepository.delete(token);
            throw new InvalidTokenException("El refresh token ha expirado o fue revocado");
        }

        // Automatic Token Rotation: Invalidate old token and generate new one
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        return createRefreshToken(token.getUser());
    }

    @Override
    @Transactional
    public void revokeRefreshToken(String rawRefreshToken) {
        String tokenHash = hashToken(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllByUser(user);
    }
}

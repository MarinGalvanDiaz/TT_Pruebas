package com.liberate.auth;

import com.liberate.auth.config.JwtProperties;
import com.liberate.auth.entity.User;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.security.JwtTokenProvider;
import com.liberate.auth.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTests {

    private JwtTokenProvider tokenProvider;
    private JwtProperties jwtProperties;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties();
        jwtProperties.setSecret("dGhpcy1pcy1hLXZlcnktc2VjdXJlLTI1Ni1iaXQtc2VjcmV0LWtleS1mb3ItbGliZXJhdGUtYXBw");
        jwtProperties.setAccessTokenExpirationMs(60000); // 1 min
        jwtProperties.setIssuer("liberate-test");

        tokenProvider = new JwtTokenProvider(jwtProperties);
    }

    @Test
    @DisplayName("Should generate valid JWT access token and extract user ID correctly")
    void testGenerateAndValidateToken() {
        User user = new User("Camila Silva", "camila@liberate.org", "hash123", UserRole.ADOLESCENTES);
        UserPrincipal principal = UserPrincipal.create(user);

        String token = tokenProvider.generateAccessToken(principal);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(user.getId(), tokenProvider.getUserIdFromToken(token));
    }

    @Test
    @DisplayName("Should reject invalid or malformed token")
    void testInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalid.token.string"));
    }

    @Test
    @DisplayName("Should reject expired token")
    void testExpiredToken() {
        jwtProperties.setAccessTokenExpirationMs(-1000); // Already expired
        JwtTokenProvider expiredProvider = new JwtTokenProvider(jwtProperties);

        User user = new User("Mateo", "mateo@liberate.org", "hash", UserRole.ADOLESCENTES);
        UserPrincipal principal = UserPrincipal.create(user);

        String token = expiredProvider.generateAccessToken(principal);

        assertFalse(expiredProvider.validateToken(token));
    }
}

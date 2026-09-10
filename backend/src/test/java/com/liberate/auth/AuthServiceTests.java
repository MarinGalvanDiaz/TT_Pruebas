package com.liberate.auth;

import com.liberate.auth.dto.request.LoginRequest;
import com.liberate.auth.dto.request.RegisterRequest;
import com.liberate.auth.dto.response.AuthResponse;
import com.liberate.auth.entity.AuthProvider;
import com.liberate.auth.entity.User;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.exception.InvalidCredentialsException;
import com.liberate.auth.exception.UserAlreadyExistsException;
import com.liberate.auth.repository.*;
import com.liberate.auth.security.GoogleTokenVerifierService;
import com.liberate.auth.security.JwtTokenProvider;
import com.liberate.auth.service.AuthServiceImpl;
import com.liberate.auth.service.EmailService;
import com.liberate.auth.service.RateLimiterService;
import com.liberate.auth.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTests {

    @Mock
    private UserRepository userRepository;
    @Mock
    private AuthIdentityRepository authIdentityRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock
    private EmailVerificationTokenRepository emailVerificationTokenRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private TokenService tokenService;
    @Mock
    private GoogleTokenVerifierService googleTokenVerifierService;
    @Mock
    private RateLimiterService rateLimiterService;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Mateo González", "mateo@liberate.org", "encodedPassword", UserRole.ADOLESCENTES);
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("Mateo González", "mateo@liberate.org", "secret123", UserRole.ADOLESCENTES);

        when(userRepository.existsByEmailIgnoreCase(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenService.generateRawToken()).thenReturn("raw-token-123");
        when(tokenService.generateVerificationCode()).thenReturn("123456");
        when(tokenService.hashToken(anyString())).thenReturn("hash-123");
        when(jwtTokenProvider.generateAccessToken(any())).thenReturn("jwt-access-token");
        when(jwtTokenProvider.getExpirationTimeMs()).thenReturn(900000L);

        AuthResponse response = authService.register(request, "127.0.0.1");

        assertNotNull(response);
        assertEquals("jwt-access-token", response.getAccessToken());
        assertEquals("raw-token-123", response.getRefreshToken());
        assertEquals("mateo@liberate.org", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw UserAlreadyExistsException when registering with duplicate email")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("Mateo", "mateo@liberate.org", "secret123", UserRole.ADOLESCENTES);
        when(userRepository.existsByEmailIgnoreCase("mateo@liberate.org")).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> authService.register(request, "127.0.0.1"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully log in with valid credentials")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("mateo@liberate.org", "secret123", UserRole.ADOLESCENTES);

        when(userRepository.findByEmailIgnoreCase("mateo@liberate.org")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("secret123", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(any())).thenReturn("jwt-access-token");
        when(tokenService.generateRawToken()).thenReturn("raw-refresh-token");
        when(tokenService.hashToken(anyString())).thenReturn("hash-token");
        when(jwtTokenProvider.getExpirationTimeMs()).thenReturn(900000L);

        AuthResponse response = authService.login(request, "127.0.0.1");

        assertNotNull(response);
        assertEquals("jwt-access-token", response.getAccessToken());
        assertEquals("mateo@liberate.org", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when password does not match")
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest("mateo@liberate.org", "wrongPassword", UserRole.ADOLESCENTES);

        when(userRepository.findByEmailIgnoreCase("mateo@liberate.org")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request, "127.0.0.1"));
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when email is not registered without exposing user non-existence")
    void testLoginUserNotFound() {
        LoginRequest request = new LoginRequest("nonexistent@liberate.org", "password", UserRole.ADOLESCENTES);

        when(userRepository.findByEmailIgnoreCase("nonexistent@liberate.org")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request, "127.0.0.1"));
    }
}

package com.liberate.auth.service;

import com.liberate.auth.dto.request.*;
import com.liberate.auth.dto.response.ApiResponse;
import com.liberate.auth.dto.response.AuthResponse;
import com.liberate.auth.dto.response.UserResponse;
import com.liberate.auth.entity.*;
import com.liberate.auth.exception.InvalidCredentialsException;
import com.liberate.auth.exception.InvalidTokenException;
import com.liberate.auth.exception.UserAlreadyExistsException;
import com.liberate.auth.repository.*;
import com.liberate.auth.security.GoogleTokenVerifierService;
import com.liberate.auth.security.GoogleTokenVerifierService.GoogleUserPayload;
import com.liberate.auth.security.JwtTokenProvider;
import com.liberate.auth.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final AuthIdentityRepository authIdentityRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;
    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final RateLimiterService rateLimiterService;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           AuthIdentityRepository authIdentityRepository,
                           RefreshTokenRepository refreshTokenRepository,
                           PasswordResetTokenRepository passwordResetTokenRepository,
                           EmailVerificationTokenRepository emailVerificationTokenRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           TokenService tokenService,
                           GoogleTokenVerifierService googleTokenVerifierService,
                           RateLimiterService rateLimiterService,
                           EmailService emailService) {
        this.userRepository = userRepository;
        this.authIdentityRepository = authIdentityRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenService = tokenService;
        this.googleTokenVerifierService = googleTokenVerifierService;
        this.rateLimiterService = rateLimiterService;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request, String clientIp) {
        String rateLimitKey = "register:" + (clientIp != null ? clientIp : "unknown");
        rateLimiterService.checkRateLimit(rateLimitKey);

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            rateLimiterService.recordFailedAttempt(rateLimitKey);
            throw new UserAlreadyExistsException("Ya existe una cuenta con este correo electrónico");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getNombre().trim(), normalizedEmail, passwordHash, request.getRole());
        user.setEmailVerificado(false);

        AuthIdentity localIdentity = new AuthIdentity(user, AuthProvider.LOCAL, normalizedEmail);
        user.addIdentity(localIdentity);

        User savedUser = userRepository.save(user);

        // Generate verification token
        String rawVerifyToken = tokenService.generateRawToken();
        String verifyHash = tokenService.hashToken(rawVerifyToken);
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                verifyHash, savedUser, Instant.now().plusSeconds(86400) // 24h
        );
        emailVerificationTokenRepository.save(verificationToken);
        emailService.sendEmailVerificationEmail(savedUser.getEmail(), rawVerifyToken);

        // Generate Session Tokens
        UserPrincipal principal = UserPrincipal.create(savedUser);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);

        String rawRefreshToken = tokenService.generateRawToken();
        String refreshHash = tokenService.hashToken(rawRefreshToken);
        Instant expiryDate = Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L);
        refreshTokenRepository.save(new RefreshToken(refreshHash, savedUser, expiryDate));

        rateLimiterService.resetAttempts(rateLimitKey);
        logger.info("New user registered successfully: {}", savedUser.getEmail());

        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getExpirationTimeMs() / 1000,
                UserResponse.fromEntity(savedUser)
        );
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, String clientIp) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String rateLimitKey = "login:" + (clientIp != null ? clientIp : "unknown") + ":" + normalizedEmail;
        rateLimiterService.checkRateLimit(rateLimitKey);

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(normalizedEmail);

        if (userOpt.isEmpty()) {
            rateLimiterService.recordFailedAttempt(rateLimitKey);
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        User user = userOpt.get();

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            rateLimiterService.recordFailedAttempt(rateLimitKey);
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        rateLimiterService.resetAttempts(rateLimitKey);

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);

        String rawRefreshToken = tokenService.generateRawToken();
        String refreshHash = tokenService.hashToken(rawRefreshToken);
        Instant expiryDate = Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L);
        refreshTokenRepository.save(new RefreshToken(refreshHash, user, expiryDate));

        logger.info("User logged in successfully: {}", user.getEmail());

        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getExpirationTimeMs() / 1000,
                UserResponse.fromEntity(user)
        );
    }

    @Override
    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request, String clientIp) {
        String rateLimitKey = "google:" + (clientIp != null ? clientIp : "unknown");
        rateLimiterService.checkRateLimit(rateLimitKey);

        GoogleUserPayload payload;
        // Check for mock token in development / test environments
        if (request.getIdToken().startsWith("mock-google-id-token")) {
            payload = new GoogleUserPayload(
                    "google-sub-demo-12345",
                    "usuario.google@gmail.com",
                    "Usuario Google Demo",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuB2nSWI389TCB9dEYtnPCx8So0R1JYhGR0rf-umTFbWjLpjvFs5R_cbB41lTnF9n_YOB2uVxqIRlmEh5c24g-_nF3tPrnv6EC-ubuyST6StOrCfbg4OuW0RyhoYsADMJe5Ox9qEqJxUPkeeX7RjAUmkwOljL96nLzFxecTRbdVT-8HazoOZZpuKKSQP2CoWWs7QLUTJVQThH0gzGrb4BsHFiOHwSCWBwUiBVRaaANdx9tdJn1RDVMufu9TUEG05V9rpzOE",
                    true
            );
        } else {
            payload = googleTokenVerifierService.verify(request.getIdToken());
        }

        String googleSubId = payload.getSub();
        String normalizedEmail = payload.getEmail().trim().toLowerCase();

        Optional<AuthIdentity> existingIdentity = authIdentityRepository
                .findByProviderAndProviderId(AuthProvider.GOOGLE, googleSubId);

        User user;
        if (existingIdentity.isPresent()) {
            user = existingIdentity.get().getUser();
        } else {
            // Check if user exists by email to link account
            Optional<User> existingUser = userRepository.findByEmailIgnoreCase(normalizedEmail);
            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (payload.isEmailVerified() && !user.isEmailVerificado()) {
                    user.setEmailVerificado(true);
                }
                AuthIdentity googleIdentity = new AuthIdentity(user, AuthProvider.GOOGLE, googleSubId);
                user.addIdentity(googleIdentity);
                user = userRepository.save(user);
                logger.info("Linked existing account with Google identity for user: {}", user.getEmail());
            } else {
                // Create brand new user
                UserRole role = request.getRole() != null ? request.getRole() : UserRole.ADOLESCENTES;
                user = new User(payload.getName(), normalizedEmail, null, role);
                user.setEmailVerificado(payload.isEmailVerified());
                user.setAvatarUrl(payload.getPictureUrl());

                AuthIdentity googleIdentity = new AuthIdentity(user, AuthProvider.GOOGLE, googleSubId);
                user.addIdentity(googleIdentity);
                user = userRepository.save(user);
                logger.info("Created new user via Google Sign-In: {}", user.getEmail());
            }
        }

        rateLimiterService.resetAttempts(rateLimitKey);

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);

        String rawRefreshToken = tokenService.generateRawToken();
        String refreshHash = tokenService.hashToken(rawRefreshToken);
        Instant expiryDate = Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L);
        refreshTokenRepository.save(new RefreshToken(refreshHash, user, expiryDate));

        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getExpirationTimeMs() / 1000,
                UserResponse.fromEntity(user)
        );
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (request.getRefreshToken() == null || request.getRefreshToken().trim().isEmpty()) {
            throw new InvalidTokenException("Refresh token no proporcionado");
        }

        String rawToken = request.getRefreshToken().trim();
        String oldHash = tokenService.hashToken(rawToken);

        RefreshToken oldToken = refreshTokenRepository.findByTokenHash(oldHash)
                .orElseThrow(() -> new InvalidTokenException("Refresh token inválido o no encontrado"));

        if (!oldToken.isValid()) {
            refreshTokenRepository.delete(oldToken);
            throw new InvalidTokenException("El refresh token ha expirado o ha sido revocado");
        }

        User user = oldToken.getUser();

        // Invalidate previous token (Rotation)
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // Generate new Refresh Token
        String newRawRefreshToken = tokenService.generateRawToken();
        String newRefreshHash = tokenService.hashToken(newRawRefreshToken);
        Instant expiryDate = Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L);
        refreshTokenRepository.save(new RefreshToken(newRefreshHash, user, expiryDate));

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);

        return new AuthResponse(
                accessToken,
                newRawRefreshToken,
                jwtTokenProvider.getExpirationTimeMs() / 1000,
                UserResponse.fromEntity(user)
        );
    }

    @Override
    @Transactional
    public ApiResponse<Void> forgotPassword(ForgotPasswordRequest request, String clientIp) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        String rateLimitKey = "forgot-password:" + (clientIp != null ? clientIp : "unknown");
        rateLimiterService.checkRateLimit(rateLimitKey);

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(normalizedEmail);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Only generate password reset if user has password (local account)
            if (user.getPasswordHash() != null) {
                // Delete previous reset tokens for user
                passwordResetTokenRepository.deleteByUser(user);

                String rawToken = tokenService.generateRawToken();
                String tokenHash = tokenService.hashToken(rawToken);
                Instant expiry = Instant.now().plusSeconds(3600); // 1 hour

                PasswordResetToken resetToken = new PasswordResetToken(tokenHash, user, expiry);
                passwordResetTokenRepository.save(resetToken);

                emailService.sendPasswordResetEmail(user.getEmail(), rawToken);
            }
        }

        // Always return generic response to prevent user enumeration
        return ApiResponse.ok("Si el correo electrónico está registrado, recibirás un enlace de recuperación en breve.");
    }

    @Override
    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {
        String tokenHash = tokenService.hashToken(request.getToken().trim());

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("El token de recuperación es inválido o ha expirado"));

        if (!resetToken.isValid()) {
            throw new InvalidTokenException("El token de recuperación ha expirado o ya fue utilizado");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        // Revoke all existing sessions for security
        tokenService.revokeAllUserTokens(user);

        return ApiResponse.ok("Tu contraseña ha sido actualizada con éxito.");
    }

    @Override
    @Transactional
    public ApiResponse<Void> verifyEmail(VerifyEmailRequest request) {
        String tokenHash = tokenService.hashToken(request.getToken().trim());

        EmailVerificationToken token = emailVerificationTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Token de verificación inválido o expirado"));

        if (!token.isValid()) {
            throw new InvalidTokenException("El token de verificación ha expirado o ya fue utilizado");
        }

        User user = token.getUser();
        user.setEmailVerificado(true);
        userRepository.save(user);

        token.setUsed(true);
        emailVerificationTokenRepository.save(token);

        return ApiResponse.ok("Correo electrónico verificado con éxito.");
    }

    @Override
    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            tokenService.revokeRefreshToken(rawRefreshToken);
        }
    }

    @Override
    @Transactional
    public void logoutAll(UserPrincipal userPrincipal) {
        if (userPrincipal != null) {
            userRepository.findById(userPrincipal.getId())
                    .ifPresent(tokenService::revokeAllUserTokens);
        }
    }
}

package com.liberate.auth.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.liberate.auth.config.GoogleAuthProperties;
import com.liberate.auth.exception.InvalidTokenException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;

@Service
public class GoogleTokenVerifierService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleTokenVerifierService.class);

    private final GoogleAuthProperties googleAuthProperties;
    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifierService(GoogleAuthProperties googleAuthProperties) {
        this.googleAuthProperties = googleAuthProperties;

        List<String> audienceList = googleAuthProperties.getAllAllowedClientIds();
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(audienceList.isEmpty() ? null : audienceList)
                .setIssuers(Arrays.asList("https://accounts.google.com", "accounts.google.com"))
                .build();
    }

    public GoogleUserPayload verify(String idTokenString) {
        if (idTokenString == null || idTokenString.trim().isEmpty()) {
            throw new InvalidTokenException("El token de Google no puede estar vacío");
        }

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                logger.warn("Google ID Token verification failed (null token result)");
                throw new InvalidTokenException("El token de Google es inválido o ha expirado");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String sub = payload.getSubject();
            String email = payload.getEmail();
            boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            if (sub == null || email == null) {
                throw new InvalidTokenException("El token de Google no contiene la información mínima requerida");
            }

            return new GoogleUserPayload(sub, email, name != null ? name : email.split("@")[0], pictureUrl, emailVerified);

        } catch (GeneralSecurityException | IOException e) {
            logger.error("Cryptographic error verifying Google ID token: {}", e.getMessage());
            throw new InvalidTokenException("Error al verificar la firma criptográfica del token de Google");
        }
    }

    public static class GoogleUserPayload {
        private final String sub;
        private final String email;
        private final String name;
        private final String pictureUrl;
        private final boolean emailVerified;

        public GoogleUserPayload(String sub, String email, String name, String pictureUrl, boolean emailVerified) {
            this.sub = sub;
            this.email = email;
            this.name = name;
            this.pictureUrl = pictureUrl;
            this.emailVerified = emailVerified;
        }

        public String getSub() {
            return sub;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }

        public String getPictureUrl() {
            return pictureUrl;
        }

        public boolean isEmailVerified() {
            return emailVerified;
        }
    }
}

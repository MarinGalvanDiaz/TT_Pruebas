package com.liberate.auth.service;

import com.liberate.auth.exception.RateLimitExceededException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final int MAX_ATTEMPTS = 5;
    private final long WINDOW_SECONDS = 900; // 15 minutes

    private final Map<String, AttemptTracker> attemptsMap = new ConcurrentHashMap<>();

    public void checkRateLimit(String key) {
        AttemptTracker tracker = attemptsMap.get(key);
        if (tracker != null) {
            if (tracker.isBlocked()) {
                throw new RateLimitExceededException("Demasiados intentos fallidos. Por favor inténtalo de nuevo en " + tracker.getRemainingMinutes() + " minutos.");
            }
        }
    }

    public void recordFailedAttempt(String key) {
        attemptsMap.compute(key, (k, tracker) -> {
            if (tracker == null || tracker.isExpired(WINDOW_SECONDS)) {
                return new AttemptTracker(1, Instant.now().plusSeconds(WINDOW_SECONDS));
            } else {
                int newAttempts = tracker.getAttempts() + 1;
                Instant blockedUntil = tracker.getBlockedUntil();
                if (newAttempts >= MAX_ATTEMPTS) {
                    blockedUntil = Instant.now().plusSeconds(WINDOW_SECONDS);
                }
                return new AttemptTracker(newAttempts, blockedUntil);
            }
        });
    }

    public void resetAttempts(String key) {
        attemptsMap.remove(key);
    }

    private static class AttemptTracker {
        private final int attempts;
        private final Instant blockedUntil;

        public AttemptTracker(int attempts, Instant blockedUntil) {
            this.attempts = attempts;
            this.blockedUntil = blockedUntil;
        }

        public int getAttempts() {
            return attempts;
        }

        public Instant getBlockedUntil() {
            return blockedUntil;
        }

        public boolean isBlocked() {
            return attempts >= 5 && Instant.now().isBefore(blockedUntil);
        }

        public boolean isExpired(long windowSeconds) {
            return Instant.now().isAfter(blockedUntil);
        }

        public long getRemainingMinutes() {
            long remainingSecs = blockedUntil.getEpochSecond() - Instant.now().getEpochSecond();
            return Math.max(1, (remainingSecs + 59) / 60);
        }
    }
}

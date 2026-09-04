package com.liberate.auth.exception;

public class RateLimitExceededException extends AppException {
    public RateLimitExceededException(String message) {
        super(message, "RATE_LIMIT_EXCEEDED");
    }

    public RateLimitExceededException() {
        super("Demasiados intentos fallidos. Por favor inténtalo más tarde.", "RATE_LIMIT_EXCEEDED");
    }
}

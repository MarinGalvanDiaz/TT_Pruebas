package com.liberate.auth.exception;

public class InvalidTokenException extends AppException {
    public InvalidTokenException(String message) {
        super(message, "INVALID_TOKEN");
    }

    public InvalidTokenException() {
        super("Token inválido o expirado", "INVALID_TOKEN");
    }
}

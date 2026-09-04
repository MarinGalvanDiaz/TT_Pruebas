package com.liberate.auth.exception;

public class InvalidCredentialsException extends AppException {
    public InvalidCredentialsException(String message) {
        super(message, "INVALID_CREDENTIALS");
    }

    public InvalidCredentialsException() {
        super("Credenciales inválidas", "INVALID_CREDENTIALS");
    }
}

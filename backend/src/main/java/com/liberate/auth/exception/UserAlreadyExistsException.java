package com.liberate.auth.exception;

public class UserAlreadyExistsException extends AppException {
    public UserAlreadyExistsException(String message) {
        super(message, "USER_ALREADY_EXISTS");
    }

    public UserAlreadyExistsException() {
        super("Ya existe una cuenta con este correo electrónico", "USER_ALREADY_EXISTS");
    }
}

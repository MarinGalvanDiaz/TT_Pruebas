package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SendDirectoryRequest {

    @NotBlank(message = "El correo de destino es requerido")
    @Email(message = "El formato de correo no es válido")
    private String email;

    private String nombre;

    public SendDirectoryRequest() {}

    public SendDirectoryRequest(String email, String nombre) {
        this.email = email;
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}


package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TutorBlockARequest {

    @NotBlank(message = "El token de la solicitud es requerido")
    private String token;

    @NotBlank(message = "El nombre completo del adolescente es requerido")
    private String nombreAdolescente;

    @NotNull(message = "La fecha de nacimiento es requerida")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El correo del adolescente es requerido")
    @Email(message = "El formato de correo del adolescente no es válido")
    private String emailAdolescente;

    @NotNull(message = "Debe indicar si cuenta con dispositivo y conexión a internet")
    private Boolean tieneDispositivo;

    private String nacionalidad = "Mexicana";

    public TutorBlockARequest() {}

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNombreAdolescente() {
        return nombreAdolescente;
    }

    public void setNombreAdolescente(String nombreAdolescente) {
        this.nombreAdolescente = nombreAdolescente;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getEmailAdolescente() {
        return emailAdolescente;
    }

    public void setEmailAdolescente(String emailAdolescente) {
        this.emailAdolescente = emailAdolescente;
    }

    public Boolean getTieneDispositivo() {
        return tieneDispositivo;
    }

    public void setTieneDispositivo(Boolean tieneDispositivo) {
        this.tieneDispositivo = tieneDispositivo;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }
}


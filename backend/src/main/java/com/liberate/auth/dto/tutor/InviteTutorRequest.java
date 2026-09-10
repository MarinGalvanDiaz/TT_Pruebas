package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InviteTutorRequest {

    @NotBlank(message = "El nombre del adolescente es requerido")
    private String nombreAdolescente;

    @NotNull(message = "La edad del adolescente es requerida")
    @Min(value = 1, message = "La edad debe ser mayor a 0")
    @Max(value = 17, message = "Este flujo es solo para menores de 18 años")
    private Integer edadAdolescente;

    @NotBlank(message = "El correo del tutor es requerido")
    @Email(message = "El formato de correo del tutor no es válido")
    private String emailTutor;

    @Email(message = "El formato de correo del adolescente no es válido")
    private String emailAdolescente;

    public InviteTutorRequest() {}

    public InviteTutorRequest(String nombreAdolescente, Integer edadAdolescente, String emailTutor, String emailAdolescente) {
        this.nombreAdolescente = nombreAdolescente;
        this.edadAdolescente = edadAdolescente;
        this.emailTutor = emailTutor;
        this.emailAdolescente = emailAdolescente;
    }

    public String getNombreAdolescente() {
        return nombreAdolescente;
    }

    public void setNombreAdolescente(String nombreAdolescente) {
        this.nombreAdolescente = nombreAdolescente;
    }

    public Integer getEdadAdolescente() {
        return edadAdolescente;
    }

    public void setEdadAdolescente(Integer edadAdolescente) {
        this.edadAdolescente = edadAdolescente;
    }

    public String getEmailTutor() {
        return emailTutor;
    }

    public void setEmailTutor(String emailTutor) {
        this.emailTutor = emailTutor;
    }

    public String getEmailAdolescente() {
        return emailAdolescente;
    }

    public void setEmailAdolescente(String emailAdolescente) {
        this.emailAdolescente = emailAdolescente;
    }
}


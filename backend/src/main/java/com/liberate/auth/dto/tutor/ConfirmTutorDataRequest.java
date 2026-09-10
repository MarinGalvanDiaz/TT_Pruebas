package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ConfirmTutorDataRequest {

    @NotBlank(message = "El token de la solicitud es requerido")
    private String token;

    @NotBlank(message = "El número de WhatsApp es requerido")
    @Pattern(regexp = "^[0-9]{10}$", message = "El número telefónico debe contener exactamente 10 dígitos numéricos")
    private String telefonoTutor;

    private boolean autorizaWhatsapp;

    public ConfirmTutorDataRequest() {}

    public ConfirmTutorDataRequest(String token, String telefonoTutor, boolean autorizaWhatsapp) {
        this.token = token;
        this.telefonoTutor = telefonoTutor;
        this.autorizaWhatsapp = autorizaWhatsapp;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTelefonoTutor() {
        return telefonoTutor;
    }

    public void setTelefonoTutor(String telefonoTutor) {
        this.telefonoTutor = telefonoTutor;
    }

    public boolean isAutorizaWhatsapp() {
        return autorizaWhatsapp;
    }

    public void setAutorizaWhatsapp(boolean autorizaWhatsapp) {
        this.autorizaWhatsapp = autorizaWhatsapp;
    }
}


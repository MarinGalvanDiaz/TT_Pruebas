package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TutorConsentRequest {

    @NotBlank(message = "El token de la solicitud es requerido")
    private String token;

    @NotBlank(message = "Debe ingresar su nombre completo como firma de consentimiento")
    private String nombreFirma;

    @NotNull(message = "Debe indicar si acepta o no participar")
    private Boolean acepto;

    public TutorConsentRequest() {}

    public TutorConsentRequest(String token, String nombreFirma, Boolean acepto) {
        this.token = token;
        this.nombreFirma = nombreFirma;
        this.acepto = acepto;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNombreFirma() {
        return nombreFirma;
    }

    public void setNombreFirma(String nombreFirma) {
        this.nombreFirma = nombreFirma;
    }

    public Boolean getAcepto() {
        return acepto;
    }

    public void setAcepto(Boolean acepto) {
        this.acepto = acepto;
    }
}


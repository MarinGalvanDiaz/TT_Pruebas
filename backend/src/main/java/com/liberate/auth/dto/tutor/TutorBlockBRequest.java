package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TutorBlockBRequest {

    @NotBlank(message = "El token de la solicitud es requerido")
    private String token;

    @NotBlank(message = "Debe responder la pregunta sobre condición del neurodesarrollo")
    @Pattern(regexp = "^(SI|NO|NO_SE)$", message = "La respuesta debe ser SI, NO o NO_SE")
    private String neurodesarrollo;

    @NotBlank(message = "Debe responder la pregunta sobre atención psicológica o psiquiátrica actual")
    @Pattern(regexp = "^(SI|NO|NO_SE)$", message = "La respuesta debe ser SI, NO o NO_SE")
    private String atencionActual;

    @NotBlank(message = "Debe responder la pregunta sobre otro diagnóstico de salud mental")
    @Pattern(regexp = "^(SI|NO|NO_SE)$", message = "La respuesta debe ser SI, NO o NO_SE")
    private String otroDiagnostico;

    @NotBlank(message = "Debe responder la pregunta sobre situación de violencia")
    @Pattern(regexp = "^(SI|NO|NO_SE)$", message = "La respuesta debe ser SI, NO o NO_SE")
    private String violencia;

    public TutorBlockBRequest() {}

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNeurodesarrollo() {
        return neurodesarrollo;
    }

    public void setNeurodesarrollo(String neurodesarrollo) {
        this.neurodesarrollo = neurodesarrollo;
    }

    public String getAtencionActual() {
        return atencionActual;
    }

    public void setAtencionActual(String atencionActual) {
        this.atencionActual = atencionActual;
    }

    public String getOtroDiagnostico() {
        return otroDiagnostico;
    }

    public void setOtroDiagnostico(String otroDiagnostico) {
        this.otroDiagnostico = otroDiagnostico;
    }

    public String getViolencia() {
        return violencia;
    }

    public void setViolencia(String violencia) {
        this.violencia = violencia;
    }
}


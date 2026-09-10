package com.liberate.auth.dto.tutor;

import jakarta.validation.constraints.NotBlank;

public class TutorSymptomsRequest {

    @NotBlank(message = "El token de la solicitud es requerido")
    private String token;

    @NotBlank(message = "Las respuestas de la escala de síntomas son requeridas")
    private String respuestasLikertJson;

    public TutorSymptomsRequest() {}

    public TutorSymptomsRequest(String token, String respuestasLikertJson) {
        this.token = token;
        this.respuestasLikertJson = respuestasLikertJson;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRespuestasLikertJson() {
        return respuestasLikertJson;
    }

    public void setRespuestasLikertJson(String respuestasLikertJson) {
        this.respuestasLikertJson = respuestasLikertJson;
    }
}


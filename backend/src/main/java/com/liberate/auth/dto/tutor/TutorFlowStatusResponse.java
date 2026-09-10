package com.liberate.auth.dto.tutor;

import java.time.Instant;
import java.time.LocalDate;

public class TutorFlowStatusResponse {

    private String token;
    private String estado;
    private String emailTutor;
    private String telefonoTutor;
    private boolean autorizaWhatsapp;
    private boolean consentimientoFirmado;
    private String consentimientoFirmaNombre;
    private String adolescenteNombre;
    private LocalDate adolescenteFechaNacimiento;
    private Integer adolescenteEdad;
    private String adolescenteEmail;
    private Boolean adolescenteTieneDispositivo;
    private String adolescenteNacionalidad;
    private String derivacionTipo; // NONE, GENERAL, PRIORITARIA
    private boolean cuentaDesbloqueada;
    private Instant expiresAt;
    private int reenviosCount;

    public TutorFlowStatusResponse() {}

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getEmailTutor() {
        return emailTutor;
    }

    public void setEmailTutor(String emailTutor) {
        this.emailTutor = emailTutor;
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

    public boolean isConsentimientoFirmado() {
        return consentimientoFirmado;
    }

    public void setConsentimientoFirmado(boolean consentimientoFirmado) {
        this.consentimientoFirmado = consentimientoFirmado;
    }

    public String getConsentimientoFirmaNombre() {
        return consentimientoFirmaNombre;
    }

    public void setConsentimientoFirmaNombre(String consentimientoFirmaNombre) {
        this.consentimientoFirmaNombre = consentimientoFirmaNombre;
    }

    public String getAdolescenteNombre() {
        return adolescenteNombre;
    }

    public void setAdolescenteNombre(String adolescenteNombre) {
        this.adolescenteNombre = adolescenteNombre;
    }

    public LocalDate getAdolescenteFechaNacimiento() {
        return adolescenteFechaNacimiento;
    }

    public void setAdolescenteFechaNacimiento(LocalDate adolescenteFechaNacimiento) {
        this.adolescenteFechaNacimiento = adolescenteFechaNacimiento;
    }

    public Integer getAdolescenteEdad() {
        return adolescenteEdad;
    }

    public void setAdolescenteEdad(Integer adolescenteEdad) {
        this.adolescenteEdad = adolescenteEdad;
    }

    public String getAdolescenteEmail() {
        return adolescenteEmail;
    }

    public void setAdolescenteEmail(String adolescenteEmail) {
        this.adolescenteEmail = adolescenteEmail;
    }

    public Boolean getAdolescenteTieneDispositivo() {
        return adolescenteTieneDispositivo;
    }

    public void setAdolescenteTieneDispositivo(Boolean adolescenteTieneDispositivo) {
        this.adolescenteTieneDispositivo = adolescenteTieneDispositivo;
    }

    public String getAdolescenteNacionalidad() {
        return adolescenteNacionalidad;
    }

    public void setAdolescenteNacionalidad(String adolescenteNacionalidad) {
        this.adolescenteNacionalidad = adolescenteNacionalidad;
    }

    public String getDerivacionTipo() {
        return derivacionTipo;
    }

    public void setDerivacionTipo(String derivacionTipo) {
        this.derivacionTipo = derivacionTipo;
    }

    public boolean isCuentaDesbloqueada() {
        return cuentaDesbloqueada;
    }

    public void setCuentaDesbloqueada(boolean cuentaDesbloqueada) {
        this.cuentaDesbloqueada = cuentaDesbloqueada;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public int getReenviosCount() {
        return reenviosCount;
    }

    public void setReenviosCount(int reenviosCount) {
        this.reenviosCount = reenviosCount;
    }
}


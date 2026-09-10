package com.liberate.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "solicitudes_tutor", indexes = {
    @Index(name = "idx_solicitud_tutor_token", columnList = "token_hash", unique = true),
    @Index(name = "idx_solicitud_tutor_email", columnList = "email_tutor"),
    @Index(name = "idx_solicitud_tutor_adolescente_email", columnList = "adolescente_email")
})
public class SolicitudTutor {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @Column(name = "token_hash", length = 64, nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "email_tutor", length = 150, nullable = false)
    private String emailTutor;

    @Column(name = "telefono_tutor", length = 20)
    private String telefonoTutor;

    @Column(name = "autoriza_whatsapp", nullable = false)
    private boolean autorizaWhatsapp = false;

    @Column(name = "estado", length = 50, nullable = false)
    private String estado = "INVITACION_ENVIADA";

    @Column(name = "consentimiento_firmado", nullable = false)
    private boolean consentimientoFirmado = false;

    @Column(name = "consentimiento_firma_nombre", length = 150)
    private String consentimientoFirmaNombre;

    @Column(name = "consentimiento_fecha")
    private Instant consentimientoFecha;

    @Column(name = "consentimiento_ip", length = 50)
    private String consentimientoIp;

    @Column(name = "adolescente_nombre", length = 150)
    private String adolescenteNombre;

    @Column(name = "adolescente_fecha_nacimiento")
    private LocalDate adolescenteFechaNacimiento;

    @Column(name = "adolescente_edad")
    private Integer adolescenteEdad;

    @Column(name = "adolescente_email", length = 150)
    private String adolescenteEmail;

    @Column(name = "adolescente_tiene_dispositivo")
    private Boolean adolescenteTieneDispositivo;

    @Column(name = "adolescente_nacionalidad", length = 50)
    private String adolescenteNacionalidad = "Mexicana";

    @Column(name = "resp_neurodesarrollo", length = 20)
    private String respNeurodesarrollo;

    @Column(name = "resp_atencion_actual", length = 20)
    private String respAtencionActual;

    @Column(name = "resp_otro_diagnostico", length = 20)
    private String respOtroDiagnostico;

    @Column(name = "resp_violencia", length = 20)
    private String respViolencia;

    @Column(name = "respuestas_sintomas_json", columnDefinition = "TEXT")
    private String respuestasSintomasJson;

    @Column(name = "reenvios_count", nullable = false)
    private int reenviosCount = 0;

    @Column(name = "ultimo_reenvio_at")
    private Instant ultimoReenvioAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "adolescente_usuario_id", length = 36)
    private String adolescenteUsuarioId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public SolicitudTutor() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.expiresAt = Instant.now().plusSeconds(72 * 3600); // 72 hours
    }

    public SolicitudTutor(String tokenHash, String emailTutor, String adolescenteNombre, Integer adolescenteEdad, String adolescenteEmail) {
        this();
        this.tokenHash = tokenHash;
        this.emailTutor = emailTutor;
        this.adolescenteNombre = adolescenteNombre;
        this.adolescenteEdad = adolescenteEdad;
        this.adolescenteEmail = adolescenteEmail;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
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

    public Instant getConsentimientoFecha() {
        return consentimientoFecha;
    }

    public void setConsentimientoFecha(Instant consentimientoFecha) {
        this.consentimientoFecha = consentimientoFecha;
    }

    public String getConsentimientoIp() {
        return consentimientoIp;
    }

    public void setConsentimientoIp(String consentimientoIp) {
        this.consentimientoIp = consentimientoIp;
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

    public String getRespNeurodesarrollo() {
        return respNeurodesarrollo;
    }

    public void setRespNeurodesarrollo(String respNeurodesarrollo) {
        this.respNeurodesarrollo = respNeurodesarrollo;
    }

    public String getRespAtencionActual() {
        return respAtencionActual;
    }

    public void setRespAtencionActual(String respAtencionActual) {
        this.respAtencionActual = respAtencionActual;
    }

    public String getRespOtroDiagnostico() {
        return respOtroDiagnostico;
    }

    public void setRespOtroDiagnostico(String respOtroDiagnostico) {
        this.respOtroDiagnostico = respOtroDiagnostico;
    }

    public String getRespViolencia() {
        return respViolencia;
    }

    public void setRespViolencia(String respViolencia) {
        this.respViolencia = respViolencia;
    }

    public String getRespuestasSintomasJson() {
        return respuestasSintomasJson;
    }

    public void setRespuestasSintomasJson(String respuestasSintomasJson) {
        this.respuestasSintomasJson = respuestasSintomasJson;
    }

    public int getReenviosCount() {
        return reenviosCount;
    }

    public void setReenviosCount(int reenviosCount) {
        this.reenviosCount = reenviosCount;
    }

    public Instant getUltimoReenvioAt() {
        return ultimoReenvioAt;
    }

    public void setUltimoReenvioAt(Instant ultimoReenvioAt) {
        this.ultimoReenvioAt = ultimoReenvioAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getAdolescenteUsuarioId() {
        return adolescenteUsuarioId;
    }

    public void setAdolescenteUsuarioId(String adolescenteUsuarioId) {
        this.adolescenteUsuarioId = adolescenteUsuarioId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}


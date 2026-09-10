package com.liberate.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "registro_intentos_menores", indexes = {
    @Index(name = "idx_registro_menores_email_tutor", columnList = "email_tutor"),
    @Index(name = "idx_registro_menores_email_adolescente", columnList = "email_adolescente")
})
public class RegistroIntentoMenor {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @Column(name = "nombre_adolescente", length = 150, nullable = false)
    private String nombreAdolescente;

    @Column(name = "edad_adolescente", nullable = false)
    private Integer edadAdolescente;

    @Column(name = "email_tutor", length = 150, nullable = false)
    private String emailTutor;

    @Column(name = "email_adolescente", length = 150)
    private String emailAdolescente;

    @Column(name = "motivo_bloqueo", length = 100, nullable = false)
    private String motivoBloqueo = "registro_bloqueado_menor";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public RegistroIntentoMenor() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    public RegistroIntentoMenor(String nombreAdolescente, Integer edadAdolescente, String emailTutor, String emailAdolescente) {
        this();
        this.nombreAdolescente = nombreAdolescente;
        this.edadAdolescente = edadAdolescente;
        this.emailTutor = emailTutor;
        this.emailAdolescente = emailAdolescente;
        this.motivoBloqueo = "registro_bloqueado_menor";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getMotivoBloqueo() {
        return motivoBloqueo;
    }

    public void setMotivoBloqueo(String motivoBloqueo) {
        this.motivoBloqueo = motivoBloqueo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}


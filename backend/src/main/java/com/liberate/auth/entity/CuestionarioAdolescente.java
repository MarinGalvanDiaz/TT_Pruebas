package com.liberate.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "cuestionarios_adolescente", indexes = {
    @Index(name = "idx_cuestionarios_usuario", columnList = "usuario_id")
})
public class CuestionarioAdolescente {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @Column(name = "cmasr2_respuestas", columnDefinition = "TEXT")
    private String cmasr2Respuestas;

    @Column(name = "cmasr2_score")
    private Integer cmasr2Score;

    @Column(name = "cmasr2_def_score")
    private Integer cmasr2DefScore;

    @Column(name = "cmasr2_inc_score")
    private Integer cmasr2IncScore;

    @Column(name = "baiy_respuestas", columnDefinition = "TEXT")
    private String baiyRespuestas;

    @Column(name = "baiy_score")
    private Integer baiyScore;

    @Column(name = "ebis_respuestas", columnDefinition = "TEXT")
    private String ebisRespuestas;

    @Column(name = "ebis_score")
    private Integer ebisScore;

    @Column(name = "ebis_bandera_roja", nullable = false)
    private boolean ebisBanderaRoja = false;

    @Column(name = "derse_respuestas", columnDefinition = "TEXT")
    private String derseRespuestas;

    @Column(name = "derse_score")
    private Integer derseScore;

    @Column(name = "derse_f1")
    private Integer derseF1;

    @Column(name = "derse_f2")
    private Integer derseF2;

    @Column(name = "derse_f3")
    private Integer derseF3;

    @Column(name = "derse_f4")
    private Integer derseF4;

    @Column(name = "instrumento_actual")
    private Integer instrumentoActual = 0;

    @Column(name = "pregunta_actual")
    private Integer preguntaActual = 0;

    @Column(name = "estado_evaluacion", length = 50, nullable = false)
    private String estadoEvaluacion = "COMPLETADO";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public CuestionarioAdolescente() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCmasr2Respuestas() {
        return cmasr2Respuestas;
    }

    public void setCmasr2Respuestas(String cmasr2Respuestas) {
        this.cmasr2Respuestas = cmasr2Respuestas;
    }

    public Integer getCmasr2Score() {
        return cmasr2Score;
    }

    public void setCmasr2Score(Integer cmasr2Score) {
        this.cmasr2Score = cmasr2Score;
    }

    public Integer getCmasr2DefScore() {
        return cmasr2DefScore;
    }

    public void setCmasr2DefScore(Integer cmasr2DefScore) {
        this.cmasr2DefScore = cmasr2DefScore;
    }

    public Integer getCmasr2IncScore() {
        return cmasr2IncScore;
    }

    public void setCmasr2IncScore(Integer cmasr2IncScore) {
        this.cmasr2IncScore = cmasr2IncScore;
    }

    public String getBaiyRespuestas() {
        return baiyRespuestas;
    }

    public void setBaiyRespuestas(String baiyRespuestas) {
        this.baiyRespuestas = baiyRespuestas;
    }

    public Integer getBaiyScore() {
        return baiyScore;
    }

    public void setBaiyScore(Integer baiyScore) {
        this.baiyScore = baiyScore;
    }

    public String getEbisRespuestas() {
        return ebisRespuestas;
    }

    public void setEbisRespuestas(String ebisRespuestas) {
        this.ebisRespuestas = ebisRespuestas;
    }

    public Integer getEbisScore() {
        return ebisScore;
    }

    public void setEbisScore(Integer ebisScore) {
        this.ebisScore = ebisScore;
    }

    public boolean isEbisBanderaRoja() {
        return ebisBanderaRoja;
    }

    public void setEbisBanderaRoja(boolean ebisBanderaRoja) {
        this.ebisBanderaRoja = ebisBanderaRoja;
    }

    public String getDerseRespuestas() {
        return derseRespuestas;
    }

    public void setDerseRespuestas(String derseRespuestas) {
        this.derseRespuestas = derseRespuestas;
    }

    public Integer getDerseScore() {
        return derseScore;
    }

    public void setDerseScore(Integer derseScore) {
        this.derseScore = derseScore;
    }

    public Integer getDerseF1() {
        return derseF1;
    }

    public void setDerseF1(Integer derseF1) {
        this.derseF1 = derseF1;
    }

    public Integer getDerseF2() {
        return derseF2;
    }

    public void setDerseF2(Integer derseF2) {
        this.derseF2 = derseF2;
    }

    public Integer getDerseF3() {
        return derseF3;
    }

    public void setDerseF3(Integer derseF3) {
        this.derseF3 = derseF3;
    }

    public Integer getDerseF4() {
        return derseF4;
    }

    public void setDerseF4(Integer derseF4) {
        this.derseF4 = derseF4;
    }

    public Integer getInstrumentoActual() {
        return instrumentoActual != null ? instrumentoActual : 0;
    }

    public void setInstrumentoActual(Integer instrumentoActual) {
        this.instrumentoActual = instrumentoActual != null ? instrumentoActual : 0;
    }

    public Integer getPreguntaActual() {
        return preguntaActual != null ? preguntaActual : 0;
    }

    public void setPreguntaActual(Integer preguntaActual) {
        this.preguntaActual = preguntaActual != null ? preguntaActual : 0;
    }

    public String getEstadoEvaluacion() {
        return estadoEvaluacion;
    }

    public void setEstadoEvaluacion(String estadoEvaluacion) {
        this.estadoEvaluacion = estadoEvaluacion;
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


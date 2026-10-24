package com.liberate.auth.dto.questionnaire;

import java.time.Instant;
import java.util.Collections;
import java.util.Map;

public class QuestionnaireProgressResponse {

    private boolean completed;
    private String status;
    private int currentInstrumentIndex;
    private int currentQuestionIndex;
    private Map<Integer, Integer> cmasr2Answers = Collections.emptyMap();
    private Map<Integer, Integer> baiyAnswers = Collections.emptyMap();
    private Map<Integer, Integer> ebisAnswers = Collections.emptyMap();
    private Map<Integer, Integer> derseAnswers = Collections.emptyMap();
    private Instant updatedAt;

    public QuestionnaireProgressResponse() {}

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getCurrentInstrumentIndex() {
        return currentInstrumentIndex;
    }

    public void setCurrentInstrumentIndex(int currentInstrumentIndex) {
        this.currentInstrumentIndex = currentInstrumentIndex;
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(int currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }

    public Map<Integer, Integer> getCmasr2Answers() {
        return cmasr2Answers;
    }

    public void setCmasr2Answers(Map<Integer, Integer> cmasr2Answers) {
        this.cmasr2Answers = cmasr2Answers;
    }

    public Map<Integer, Integer> getBaiyAnswers() {
        return baiyAnswers;
    }

    public void setBaiyAnswers(Map<Integer, Integer> baiyAnswers) {
        this.baiyAnswers = baiyAnswers;
    }

    public Map<Integer, Integer> getEbisAnswers() {
        return ebisAnswers;
    }

    public void setEbisAnswers(Map<Integer, Integer> ebisAnswers) {
        this.ebisAnswers = ebisAnswers;
    }

    public Map<Integer, Integer> getDerseAnswers() {
        return derseAnswers;
    }

    public void setDerseAnswers(Map<Integer, Integer> derseAnswers) {
        this.derseAnswers = derseAnswers;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}


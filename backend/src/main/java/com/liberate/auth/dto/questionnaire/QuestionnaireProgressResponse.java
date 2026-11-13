package com.liberate.auth.dto.questionnaire;

import java.util.Map;

public class QuestionnaireProgressResponse {

    private boolean completed;
    private String status;
    private boolean hasRedFlag;
    private int currentInstrumentIndex;
    private int currentQuestionIndex;
    private Map<Integer, Integer> cmasr2Answers;
    private Map<Integer, Integer> baiyAnswers;
    private Map<Integer, Integer> ebisAnswers;
    private Map<Integer, Integer> derseAnswers;
    private Integer cmasr2Score;
    private Integer cmasr2DefScore;
    private Integer cmasr2IncScore;
    private Integer baiyScore;
    private Integer ebisScore;
    private Integer derseScore;
    private Integer derseF1;
    private Integer derseF2;
    private Integer derseF3;
    private Integer derseF4;

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

    public boolean isHasRedFlag() {
        return hasRedFlag;
    }

    public void setHasRedFlag(boolean hasRedFlag) {
        this.hasRedFlag = hasRedFlag;
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

    public Integer getBaiyScore() {
        return baiyScore;
    }

    public void setBaiyScore(Integer baiyScore) {
        this.baiyScore = baiyScore;
    }

    public Integer getEbisScore() {
        return ebisScore;
    }

    public void setEbisScore(Integer ebisScore) {
        this.ebisScore = ebisScore;
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
}

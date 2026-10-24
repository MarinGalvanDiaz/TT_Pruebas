package com.liberate.auth.dto.questionnaire;

public class QuestionnaireResultResponse {

    private String status;
    private boolean hasRedFlag;
    private int cmasr2Score;
    private int cmasr2DefScore;
    private int cmasr2IncScore;
    private int baiyScore;
    private int ebisScore;
    private int derseScore;
    private int derseF1;
    private int derseF2;
    private int derseF3;
    private int derseF4;
    private String message;

    public QuestionnaireResultResponse() {}

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

    public int getCmasr2Score() {
        return cmasr2Score;
    }

    public void setCmasr2Score(int cmasr2Score) {
        this.cmasr2Score = cmasr2Score;
    }

    public int getCmasr2DefScore() {
        return cmasr2DefScore;
    }

    public void setCmasr2DefScore(int cmasr2DefScore) {
        this.cmasr2DefScore = cmasr2DefScore;
    }

    public int getCmasr2IncScore() {
        return cmasr2IncScore;
    }

    public void setCmasr2IncScore(int cmasr2IncScore) {
        this.cmasr2IncScore = cmasr2IncScore;
    }

    public int getBaiyScore() {
        return baiyScore;
    }

    public void setBaiyScore(int baiyScore) {
        this.baiyScore = baiyScore;
    }

    public int getEbisScore() {
        return ebisScore;
    }

    public void setEbisScore(int ebisScore) {
        this.ebisScore = ebisScore;
    }

    public int getDerseScore() {
        return derseScore;
    }

    public void setDerseScore(int derseScore) {
        this.derseScore = derseScore;
    }

    public int getDerseF1() {
        return derseF1;
    }

    public void setDerseF1(int derseF1) {
        this.derseF1 = derseF1;
    }

    public int getDerseF2() {
        return derseF2;
    }

    public void setDerseF2(int derseF2) {
        this.derseF2 = derseF2;
    }

    public int getDerseF3() {
        return derseF3;
    }

    public void setDerseF3(int derseF3) {
        this.derseF3 = derseF3;
    }

    public int getDerseF4() {
        return derseF4;
    }

    public void setDerseF4(int derseF4) {
        this.derseF4 = derseF4;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}


package com.liberate.auth.dto.questionnaire;

import java.util.Map;

public class SubmitQuestionnaireRequest {

    private Map<Integer, Integer> cmasr2Answers;
    private Map<Integer, Integer> baiyAnswers;
    private Map<Integer, Integer> ebisAnswers;
    private Map<Integer, Integer> derseAnswers;
    private Integer currentInstrumentIndex;
    private Integer currentQuestionIndex;

    public SubmitQuestionnaireRequest() {}

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

    public Integer getCurrentInstrumentIndex() {
        return currentInstrumentIndex;
    }

    public void setCurrentInstrumentIndex(Integer currentInstrumentIndex) {
        this.currentInstrumentIndex = currentInstrumentIndex;
    }

    public Integer getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(Integer currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }
}

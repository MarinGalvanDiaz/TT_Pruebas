package com.liberate.auth.dto.questionnaire;

import java.util.List;

public class QuestionnaireBatteryResponse {

    private List<QuestionnaireItemDto> cmasr2;
    private List<QuestionnaireItemDto> baiy;
    private List<QuestionnaireItemDto> ebis;
    private List<QuestionnaireItemDto> derse;
    private int totalQuestions;

    public QuestionnaireBatteryResponse() {}

    public QuestionnaireBatteryResponse(List<QuestionnaireItemDto> cmasr2,
                                        List<QuestionnaireItemDto> baiy,
                                        List<QuestionnaireItemDto> ebis,
                                        List<QuestionnaireItemDto> derse) {
        this.cmasr2 = cmasr2;
        this.baiy = baiy;
        this.ebis = ebis;
        this.derse = derse;
        this.totalQuestions = (cmasr2 != null ? cmasr2.size() : 0)
                + (baiy != null ? baiy.size() : 0)
                + (ebis != null ? ebis.size() : 0)
                + (derse != null ? derse.size() : 0);
    }

    public List<QuestionnaireItemDto> getCmasr2() {
        return cmasr2;
    }

    public void setCmasr2(List<QuestionnaireItemDto> cmasr2) {
        this.cmasr2 = cmasr2;
    }

    public List<QuestionnaireItemDto> getBaiy() {
        return baiy;
    }

    public void setBaiy(List<QuestionnaireItemDto> baiy) {
        this.baiy = baiy;
    }

    public List<QuestionnaireItemDto> getEbis() {
        return ebis;
    }

    public void setEbis(List<QuestionnaireItemDto> ebis) {
        this.ebis = ebis;
    }

    public List<QuestionnaireItemDto> getDerse() {
        return derse;
    }

    public void setDerse(List<QuestionnaireItemDto> derse) {
        this.derse = derse;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
}


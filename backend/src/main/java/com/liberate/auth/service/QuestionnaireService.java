package com.liberate.auth.service;

import com.liberate.auth.dto.questionnaire.QuestionnaireBatteryResponse;
import com.liberate.auth.dto.questionnaire.QuestionnaireProgressResponse;
import com.liberate.auth.dto.questionnaire.QuestionnaireResultResponse;
import com.liberate.auth.dto.questionnaire.SubmitQuestionnaireRequest;

public interface QuestionnaireService {

    QuestionnaireBatteryResponse getInitialBattery();

    QuestionnaireProgressResponse getProgress(String userId);

    QuestionnaireProgressResponse saveProgress(String userId, SubmitQuestionnaireRequest request);

    QuestionnaireResultResponse submitInitialQuestionnaire(String userId, SubmitQuestionnaireRequest request);

    boolean hasCompletedInitialQuestionnaire(String userId);
}

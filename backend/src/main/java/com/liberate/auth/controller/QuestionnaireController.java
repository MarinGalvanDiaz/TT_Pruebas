package com.liberate.auth.controller;

import com.liberate.auth.dto.questionnaire.QuestionnaireBatteryResponse;
import com.liberate.auth.dto.questionnaire.QuestionnaireProgressResponse;
import com.liberate.auth.dto.questionnaire.QuestionnaireResultResponse;
import com.liberate.auth.dto.questionnaire.SubmitQuestionnaireRequest;
import com.liberate.auth.dto.response.ApiResponse;
import com.liberate.auth.security.UserPrincipal;
import com.liberate.auth.service.QuestionnaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/questionnaires")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;

    public QuestionnaireController(QuestionnaireService questionnaireService) {
        this.questionnaireService = questionnaireService;
    }

    @GetMapping("/initial")
    public ResponseEntity<QuestionnaireBatteryResponse> getInitialBattery() {
        return ResponseEntity.ok(questionnaireService.getInitialBattery());
    }

    @GetMapping({"/status", "/progress"})
    public ResponseEntity<QuestionnaireProgressResponse> getStatus(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            QuestionnaireProgressResponse empty = new QuestionnaireProgressResponse();
            empty.setCompleted(false);
            empty.setStatus("NO_INICIADO");
            return ResponseEntity.ok(empty);
        }
        return ResponseEntity.ok(questionnaireService.getProgress(userPrincipal.getId()));
    }

    @PutMapping("/initial/progress")
    public ResponseEntity<ApiResponse<QuestionnaireProgressResponse>> saveProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SubmitQuestionnaireRequest request) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Debes iniciar sesión para guardar tu avance", "UNAUTHORIZED"));
        }
        QuestionnaireProgressResponse progress = questionnaireService.saveProgress(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Avance guardado automáticamente", progress));
    }

    @PostMapping("/initial/submit")
    public ResponseEntity<ApiResponse<QuestionnaireResultResponse>> submitInitial(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SubmitQuestionnaireRequest request) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Debes iniciar sesión para guardar tus respuestas", "UNAUTHORIZED"));
        }
        QuestionnaireResultResponse result = questionnaireService.submitInitialQuestionnaire(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(result.getMessage(), result));
    }
}

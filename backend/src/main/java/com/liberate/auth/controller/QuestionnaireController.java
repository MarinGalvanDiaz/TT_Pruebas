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

import java.util.Map;

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

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(Map.of("completed", false));
        }
        boolean completed = questionnaireService.hasCompletedInitialQuestionnaire(userPrincipal.getId());
        return ResponseEntity.ok(Map.of("completed", completed));
    }

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<QuestionnaireProgressResponse>> getProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Sesión no iniciada", "UNAUTHORIZED"));
        }
        QuestionnaireProgressResponse progress = questionnaireService.getProgress(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Progreso recuperado", progress));
    }

    @RequestMapping(value = "/initial/progress", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<QuestionnaireProgressResponse>> saveProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody SubmitQuestionnaireRequest request) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Debes iniciar sesión para guardar tu progreso", "UNAUTHORIZED"));
        }
        QuestionnaireProgressResponse saved = questionnaireService.saveProgress(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Progreso guardado automáticamente", saved));
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

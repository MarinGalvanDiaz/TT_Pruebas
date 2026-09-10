package com.liberate.auth.controller;

import com.liberate.auth.dto.response.ApiResponse;
import com.liberate.auth.dto.tutor.*;
import com.liberate.auth.service.TutorFlowService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/tutor-flow")
public class TutorFlowController {

    private final TutorFlowService tutorFlowService;

    public TutorFlowController(TutorFlowService tutorFlowService) {
        this.tutorFlowService = tutorFlowService;
    }

    /**
     * Pantalla 03: Inicia el flujo cuando un adolescente menor de edad intenta registrarse.
     */
    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> initiateInvite(
            @Valid @RequestBody InviteTutorRequest request
    ) {
        TutorFlowStatusResponse response = tutorFlowService.initiateTutorInvite(request);
        return ResponseEntity.ok(ApiResponse.ok("Invitación enviada exitosamente al tutor legal.", response));
    }

    /**
     * Pantalla 04 y 05: Reenvía el correo de invitación al tutor (control de 2 minutos).
     */
    @PostMapping("/resend")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> resendInvite(
            @RequestBody Map<String, String> body
    ) {
        String token = body.get("token");
        TutorFlowStatusResponse response = tutorFlowService.resendTutorInvite(token);
        return ResponseEntity.ok(ApiResponse.ok("Invitación reenviada al correo del tutor.", response));
    }

    /**
     * Consulta el estado del flujo por token para reanudar el asistente en el paso correcto.
     */
    @GetMapping("/status/{token}")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> getStatus(
            @PathVariable String token
    ) {
        TutorFlowStatusResponse response = tutorFlowService.getStatusByToken(token);
        return ResponseEntity.ok(ApiResponse.ok("Estado del flujo recuperado.", response));
    }

    /**
     * Pantalla 06 (Paso 1): Confirma datos de contacto y WhatsApp del tutor legal.
     */
    @PostMapping("/confirm-data")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> confirmData(
            @Valid @RequestBody ConfirmTutorDataRequest request
    ) {
        TutorFlowStatusResponse response = tutorFlowService.confirmTutorData(request);
        return ResponseEntity.ok(ApiResponse.ok("Datos de contacto del tutor confirmados.", response));
    }

    /**
     * Pantalla 08 (Paso 2): Consentimiento informado firmado por el tutor.
     */
    @PostMapping("/consent")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> processConsent(
            @Valid @RequestBody TutorConsentRequest request,
            HttpServletRequest servletRequest
    ) {
        String clientIp = servletRequest.getRemoteAddr();
        TutorFlowStatusResponse response = tutorFlowService.processConsent(request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok("Consentimiento procesado exitosamente.", response));
    }

    /**
     * Pantalla 09 (Paso 3, Bloque A): Datos del adolescente.
     */
    @PostMapping("/block-a")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> processBlockA(
            @Valid @RequestBody TutorBlockARequest request
    ) {
        TutorFlowStatusResponse response = tutorFlowService.processBlockA(request);
        return ResponseEntity.ok(ApiResponse.ok("Datos del adolescente registrados.", response));
    }

    /**
     * Pantalla 10 (Paso 3, Bloque B): Cuestionario de tamizaje clínico y cálculo de derivación.
     */
    @PostMapping("/block-b")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> processBlockB(
            @Valid @RequestBody TutorBlockBRequest request
    ) {
        TutorFlowStatusResponse response = tutorFlowService.processBlockB(request);
        return ResponseEntity.ok(ApiResponse.ok("Tamizaje evaluado exitosamente.", response));
    }

    /**
     * Pantalla 14 (Paso 4): Instrumento de síntomas pre-evaluación.
     */
    @PostMapping("/symptoms")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> processSymptoms(
            @Valid @RequestBody TutorSymptomsRequest request
    ) {
        TutorFlowStatusResponse response = tutorFlowService.processSymptoms(request);
        return ResponseEntity.ok(ApiResponse.ok("Evaluación de síntomas registrada.", response));
    }

    /**
     * Pantalla 15: Conclusión del flujo, desbloqueo de la cuenta del adolescente y envío de correo.
     */
    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<TutorFlowStatusResponse>> completeFlow(
            @RequestBody Map<String, String> body
    ) {
        String token = body.get("token");
        TutorFlowStatusResponse response = tutorFlowService.completeFlowAndUnlockAdolescent(token);
        return ResponseEntity.ok(ApiResponse.ok("Flujo completado. Cuenta de adolescente desbloqueada e invitada.", response));
    }

    /**
     * Pantalla 12: Envío de directorio institucional de apoyo por correo.
     */
    @PostMapping("/send-directory")
    public ResponseEntity<ApiResponse<Void>> sendDirectory(
            @Valid @RequestBody SendDirectoryRequest request
    ) {
        tutorFlowService.sendDirectoryToEmail(request);
        return ResponseEntity.ok(ApiResponse.ok("Directorio enviado exitosamente al correo especificado."));
    }
}

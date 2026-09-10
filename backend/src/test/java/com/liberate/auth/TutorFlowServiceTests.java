package com.liberate.auth;

import com.liberate.auth.dto.tutor.*;
import com.liberate.auth.entity.RegistroIntentoMenor;
import com.liberate.auth.entity.SolicitudTutor;
import com.liberate.auth.entity.User;
import com.liberate.auth.exception.AppException;
import com.liberate.auth.exception.RateLimitExceededException;
import com.liberate.auth.repository.RegistroIntentoMenorRepository;
import com.liberate.auth.repository.SolicitudTutorRepository;
import com.liberate.auth.repository.UserRepository;
import com.liberate.auth.service.EmailService;
import com.liberate.auth.service.TokenService;
import com.liberate.auth.service.TutorFlowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TutorFlowServiceTests {

    @Mock
    private SolicitudTutorRepository solicitudTutorRepository;

    @Mock
    private RegistroIntentoMenorRepository registroIntentoMenorRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenService tokenService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private TutorFlowServiceImpl tutorFlowService;

    @BeforeEach
    void setUp() {
        lenient().when(tokenService.generateRawToken()).thenReturn("raw-token-12345");
        lenient().when(tokenService.hashToken(anyString())).thenAnswer(i -> "hash-" + i.getArgument(0));
    }

    @Test
    @DisplayName("Inicia invitación a tutor legal exitosamente y registra intento de menor")
    void testInitiateTutorInvite_Success() {
        InviteTutorRequest request = new InviteTutorRequest(
                "Carlos Gómez", 15, "mama@example.com", "carlos@example.com"
        );

        when(solicitudTutorRepository.save(any(SolicitudTutor.class)))
                .thenAnswer(i -> i.getArgument(0));

        TutorFlowStatusResponse response = tutorFlowService.initiateTutorInvite(request);

        assertNotNull(response);
        assertEquals("INVITACION_ENVIADA", response.getEstado());
        assertEquals("mama@example.com", response.getEmailTutor());
        assertEquals("raw-token-12345", response.getToken());

        verify(registroIntentoMenorRepository, times(1)).save(any(RegistroIntentoMenor.class));
        verify(emailService, times(1)).sendTutorInvitationEmail(eq("mama@example.com"), eq("raw-token-12345"), eq("Carlos Gómez"));
    }

    @Test
    @DisplayName("Rechaza invitación si correo de tutor y de adolescente son idénticos")
    void testInitiateTutorInvite_SameEmail_Throws() {
        InviteTutorRequest request = new InviteTutorRequest(
                "Carlos Gómez", 15, "mismo@example.com", "mismo@example.com"
        );

        assertThrows(AppException.class, () -> tutorFlowService.initiateTutorInvite(request));
        verify(registroIntentoMenorRepository, never()).save(any());
        verify(emailService, never()).sendTutorInvitationEmail(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Aplica derivación prioritaria ante respuesta afirmativa de violencia en Bloque B")
    void testBlockB_PriorityDerivation() {
        SolicitudTutor solicitud = new SolicitudTutor("hash-tok", "mama@example.com", "Carlos", 15, "carlos@example.com");
        solicitud.setTelefonoTutor("5512345678");

        when(solicitudTutorRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(solicitud));
        when(solicitudTutorRepository.save(any(SolicitudTutor.class)))
                .thenAnswer(i -> i.getArgument(0));

        TutorBlockBRequest request = new TutorBlockBRequest();
        request.setToken("tok");
        request.setNeurodesarrollo("NO");
        request.setAtencionActual("NO");
        request.setOtroDiagnostico("NO");
        request.setViolencia("SI"); // Provoca derivación prioritaria

        TutorFlowStatusResponse response = tutorFlowService.processBlockB(request);

        assertEquals("DERIVACION_PRIORITARIA", response.getEstado());
        assertEquals("PRIORITARIA", response.getDerivacionTipo());
        verify(emailService, times(1)).sendPriorityClinicalAlert(eq("mama@example.com"), eq("5512345678"), eq("Carlos"), eq(15));
    }

    @Test
    @DisplayName("Aplica derivación general cuando existen diagnósticos de exclusión en Bloque B")
    void testBlockB_GeneralDerivation() {
        SolicitudTutor solicitud = new SolicitudTutor("hash-tok", "mama@example.com", "Carlos", 15, "carlos@example.com");

        when(solicitudTutorRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(solicitud));
        when(solicitudTutorRepository.save(any(SolicitudTutor.class)))
                .thenAnswer(i -> i.getArgument(0));

        TutorBlockBRequest request = new TutorBlockBRequest();
        request.setToken("tok");
        request.setNeurodesarrollo("SI"); // Condición que requiere derivación general
        request.setAtencionActual("NO");
        request.setOtroDiagnostico("NO");
        request.setViolencia("NO");

        TutorFlowStatusResponse response = tutorFlowService.processBlockB(request);

        assertEquals("DERIVACION_GENERAL", response.getEstado());
        assertEquals("GENERAL", response.getDerivacionTipo());
    }

    @Test
    @DisplayName("Desbloquea la cuenta del adolescente al completar el flujo (Pantalla 15)")
    void testCompleteFlow_UnlocksAdolescent() {
        SolicitudTutor solicitud = new SolicitudTutor("hash-tok", "mama@example.com", "Carlos", 15, "carlos@example.com");
        User user = new User("Carlos", "carlos@example.com", "hash", com.liberate.auth.entity.UserRole.ADOLESCENTES);
        user.setEstadoCuenta("PENDIENTE_DE_TUTOR");

        when(solicitudTutorRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(solicitud));
        when(userRepository.findByEmailIgnoreCase("carlos@example.com"))
                .thenReturn(Optional.of(user));
        when(solicitudTutorRepository.save(any(SolicitudTutor.class)))
                .thenAnswer(i -> i.getArgument(0));

        TutorFlowStatusResponse response = tutorFlowService.completeFlowAndUnlockAdolescent("tok");

        assertEquals("FINALIZADO_DESBLOQUEADO", response.getEstado());
        assertTrue(response.isCuentaDesbloqueada());
        assertEquals("ACTIVA", user.getEstadoCuenta());
        verify(userRepository, times(1)).save(user);
        verify(emailService, times(1)).sendAdolescentUnlockedEmail(eq("carlos@example.com"), eq("Carlos"));
    }
}


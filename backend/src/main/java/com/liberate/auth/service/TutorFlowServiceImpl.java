package com.liberate.auth.service;

import com.liberate.auth.dto.tutor.*;
import com.liberate.auth.entity.AuthIdentity;
import com.liberate.auth.entity.AuthProvider;
import com.liberate.auth.entity.PasswordResetToken;
import com.liberate.auth.entity.RegistroIntentoMenor;
import com.liberate.auth.entity.SolicitudTutor;
import com.liberate.auth.entity.User;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.exception.AppException;
import com.liberate.auth.exception.InvalidTokenException;
import com.liberate.auth.exception.RateLimitExceededException;
import com.liberate.auth.repository.PasswordResetTokenRepository;
import com.liberate.auth.repository.RegistroIntentoMenorRepository;
import com.liberate.auth.repository.SolicitudTutorRepository;
import com.liberate.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Service
public class TutorFlowServiceImpl implements TutorFlowService {

    private static final Logger logger = LoggerFactory.getLogger(TutorFlowServiceImpl.class);

    private final SolicitudTutorRepository solicitudTutorRepository;
    private final RegistroIntentoMenorRepository registroIntentoMenorRepository;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public TutorFlowServiceImpl(
            SolicitudTutorRepository solicitudTutorRepository,
            RegistroIntentoMenorRepository registroIntentoMenorRepository,
            UserRepository userRepository,
            TokenService tokenService,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            PasswordResetTokenRepository passwordResetTokenRepository
    ) {
        this.solicitudTutorRepository = solicitudTutorRepository;
        this.registroIntentoMenorRepository = registroIntentoMenorRepository;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse initiateTutorInvite(InviteTutorRequest request) {
        String tutorEmail = request.getEmailTutor().trim().toLowerCase();
        String adolescentEmail = request.getEmailAdolescente() != null ? request.getEmailAdolescente().trim().toLowerCase() : null;

        if (adolescentEmail != null && tutorEmail.equalsIgnoreCase(adolescentEmail)) {
            throw new AppException("El correo del tutor legal no puede ser idéntico al correo del adolescente.", "INVALID_TUTOR_EMAIL");
        }

        // 1. Guardar intento en registro_intentos_menores
        RegistroIntentoMenor intento = new RegistroIntentoMenor(
                request.getNombreAdolescente().trim(),
                request.getEdadAdolescente(),
                tutorEmail,
                adolescentEmail
        );
        registroIntentoMenorRepository.save(intento);
        logger.info("[TUTOR FLOW] Intento de menor registrado: {} ({} años), tutor: {}",
                intento.getNombreAdolescente(), intento.getEdadAdolescente(), tutorEmail);

        // 2. Si ya existía un usuario registrado con ese email, marcar cuenta como pendiente de tutor
        if (adolescentEmail != null) {
            userRepository.findByEmailIgnoreCase(adolescentEmail).ifPresent(user -> {
                user.setEstadoCuenta("PENDIENTE_DE_TUTOR");
                userRepository.save(user);
            });
        }

        // 3. Generar token criptográfico
        String rawToken = tokenService.generateRawToken();
        String tokenHash = tokenService.hashToken(rawToken);

        // 4. Crear solicitud de tutor con expiración de 72 horas
        SolicitudTutor solicitud = new SolicitudTutor(
                tokenHash,
                tutorEmail,
                request.getNombreAdolescente().trim(),
                request.getEdadAdolescente(),
                adolescentEmail
        );
        solicitud.setUltimoReenvioAt(Instant.now());
        solicitud.setReenviosCount(0);
        solicitudTutorRepository.save(solicitud);

        // 5. Enviar correo al tutor vía Mailtrap SMTP
        emailService.sendTutorInvitationEmail(tutorEmail, rawToken, solicitud.getAdolescenteNombre());

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(rawToken);
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse resendTutorInvite(String token) {
        SolicitudTutor solicitud = findSolicitudByToken(token);

        if (solicitud.getUltimoReenvioAt() != null) {
            long secondsSinceLast = Duration.between(solicitud.getUltimoReenvioAt(), Instant.now()).getSeconds();
            if (secondsSinceLast < 120) {
                long remaining = 120 - secondsSinceLast;
                throw new RateLimitExceededException("Debes esperar " + remaining + " segundos antes de solicitar otro reenvío (máximo cada 2 minutos).");
            }
        }

        if (solicitud.getReenviosCount() >= 3) {
            throw new RateLimitExceededException("Has alcanzado el límite máximo de 3 reenvíos de invitación en 24 horas.");
        }

        solicitud.setReenviosCount(solicitud.getReenviosCount() + 1);
        solicitud.setUltimoReenvioAt(Instant.now());
        solicitudTutorRepository.save(solicitud);

        // Reenviar correo
        emailService.sendTutorInvitationEmail(solicitud.getEmailTutor(), token, solicitud.getAdolescenteNombre());

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(token);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public TutorFlowStatusResponse getStatusByToken(String token) {
        SolicitudTutor solicitud = findSolicitudByToken(token);

        if (solicitud.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidTokenException("La solicitud de consentimiento de tutor ha expirado (72 horas).");
        }

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(token);
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse confirmTutorData(ConfirmTutorDataRequest request) {
        SolicitudTutor solicitud = findSolicitudByToken(request.getToken());

        solicitud.setTelefonoTutor(request.getTelefonoTutor().trim());
        solicitud.setAutorizaWhatsapp(request.isAutorizaWhatsapp());
        solicitud.setEstado("DATOS_CONFIRMADOS");
        solicitudTutorRepository.save(solicitud);

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(request.getToken());
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse processConsent(TutorConsentRequest request, String clientIp) {
        SolicitudTutor solicitud = findSolicitudByToken(request.getToken());

        if (!Boolean.TRUE.equals(request.getAcepto())) {
            solicitud.setConsentimientoFirmado(false);
            solicitud.setEstado("CONSENTIMIENTO_RECHAZADO");
            solicitudTutorRepository.save(solicitud);
            TutorFlowStatusResponse response = mapToResponse(solicitud);
            response.setToken(request.getToken());
            return response;
        }

        solicitud.setConsentimientoFirmado(true);
        solicitud.setConsentimientoFirmaNombre(request.getNombreFirma().trim());
        solicitud.setConsentimientoFecha(Instant.now());
        solicitud.setConsentimientoIp(clientIp);
        solicitud.setEstado("CONSENTIMIENTO_ACEPTADO");
        solicitudTutorRepository.save(solicitud);

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(request.getToken());
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse processBlockA(TutorBlockARequest request) {
        SolicitudTutor solicitud = findSolicitudByToken(request.getToken());

        String adolescentEmail = request.getEmailAdolescente().trim().toLowerCase();
        if (solicitud.getEmailTutor().equalsIgnoreCase(adolescentEmail)) {
            throw new AppException("El correo del adolescente no puede ser igual al correo del tutor legal.", "INVALID_ADOLESCENT_EMAIL");
        }

        solicitud.setAdolescenteNombre(request.getNombreAdolescente().trim());
        solicitud.setAdolescenteFechaNacimiento(request.getFechaNacimiento());
        solicitud.setAdolescenteEmail(adolescentEmail);
        solicitud.setAdolescenteTieneDispositivo(request.getTieneDispositivo());
        if (request.getNacionalidad() != null && !request.getNacionalidad().isBlank()) {
            solicitud.setAdolescenteNacionalidad(request.getNacionalidad().trim());
        }

        // Calcular edad automáticamente a partir de la fecha de nacimiento
        int calculatedAge = Period.between(request.getFechaNacimiento(), LocalDate.now()).getYears();
        solicitud.setAdolescenteEdad(calculatedAge);

        solicitudTutorRepository.save(solicitud);

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(request.getToken());
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse processBlockB(TutorBlockBRequest request) {
        SolicitudTutor solicitud = findSolicitudByToken(request.getToken());

        solicitud.setRespNeurodesarrollo(request.getNeurodesarrollo());
        solicitud.setRespAtencionActual(request.getAtencionActual());
        solicitud.setRespOtroDiagnostico(request.getOtroDiagnostico());
        solicitud.setRespViolencia(request.getViolencia());

        // Lógica de derivación clínica según especificaciones:
        // 1. Derivación Prioritaria: Situación de violencia = "SI"
        if ("SI".equalsIgnoreCase(request.getViolencia())) {
            solicitud.setEstado("DERIVACION_PRIORITARIA");
            emailService.sendPriorityClinicalAlert(
                    solicitud.getEmailTutor(),
                    solicitud.getTelefonoTutor(),
                    solicitud.getAdolescenteNombre(),
                    solicitud.getAdolescenteEdad()
            );
        }
        // 2. Derivación General: Fuera de rango de edad (menor a 12 o mayor a 17) o condiciones de exclusión
        else if ((solicitud.getAdolescenteEdad() != null && (solicitud.getAdolescenteEdad() < 12 || solicitud.getAdolescenteEdad() > 17))
                || "SI".equalsIgnoreCase(request.getNeurodesarrollo())
                || "SI".equalsIgnoreCase(request.getAtencionActual())) {
            solicitud.setEstado("DERIVACION_GENERAL");
        }
        // 3. Continuidad: Elegible para el paso de síntomas pre-evaluación
        else {
            solicitud.setEstado("TAMIZAJE_COMPLETADO");
        }

        solicitudTutorRepository.save(solicitud);

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(request.getToken());
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse processSymptoms(TutorSymptomsRequest request) {
        SolicitudTutor solicitud = findSolicitudByToken(request.getToken());

        solicitud.setRespuestasSintomasJson(request.getRespuestasLikertJson());
        solicitud.setEstado("SINTOMAS_COMPLETADOS");
        solicitudTutorRepository.save(solicitud);

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(request.getToken());
        return response;
    }

    @Override
    @Transactional
    public TutorFlowStatusResponse completeFlowAndUnlockAdolescent(String token) {
        SolicitudTutor solicitud = findSolicitudByToken(token);

        solicitud.setEstado("FINALIZADO_DESBLOQUEADO");

        // 1. Desbloquear al adolescente en la base de datos si ya tiene usuario registrado
        if (solicitud.getAdolescenteEmail() != null) {
            userRepository.findByEmailIgnoreCase(solicitud.getAdolescenteEmail()).ifPresent(user -> {
                user.setEstadoCuenta("ACTIVA");
                user.setEmailVerificado(true);
                if (solicitud.getAdolescenteEdad() != null) {
                    user.setEdad(solicitud.getAdolescenteEdad());
                }
                userRepository.save(user);
                solicitud.setAdolescenteUsuarioId(user.getId());
                logger.info("[TUTOR FLOW] Cuenta de adolescente desbloqueada y marcada como ACTIVA: {}", user.getEmail());
            });

            // Enviar correo de notificación al adolescente informando que ya puede iniciar sesión
            emailService.sendAdolescentUnlockedEmail(solicitud.getAdolescenteEmail(), solicitud.getAdolescenteNombre());
        }

        // 2. Crear cuenta de tutor con contraseña aleatoria y enviar correo de restablecimiento de contraseña
        ensureTutorAccountCreatedAndSendResetPassword(solicitud);

        solicitudTutorRepository.save(solicitud);

        TutorFlowStatusResponse response = mapToResponse(solicitud);
        response.setToken(token);
        response.setCuentaDesbloqueada(true);
        return response;
    }

    private void ensureTutorAccountCreatedAndSendResetPassword(SolicitudTutor solicitud) {
        if (solicitud.getEmailTutor() == null || solicitud.getEmailTutor().isBlank()) {
            return;
        }

        String tutorEmail = solicitud.getEmailTutor().trim().toLowerCase();

        User tutorUser = userRepository.findByEmailIgnoreCase(tutorEmail).orElseGet(() -> {
            String randomPass = UUID.randomUUID().toString().replace("-", "").substring(0, 12) + "Lt1!";
            String tutorName = (solicitud.getConsentimientoFirmaNombre() != null && !solicitud.getConsentimientoFirmaNombre().isBlank())
                    ? solicitud.getConsentimientoFirmaNombre().trim()
                    : "Tutor Legal";
            User newTutor = new User(tutorName, tutorEmail, passwordEncoder.encode(randomPass), UserRole.FAMILIAS);
            newTutor.setEstadoCuenta("ACTIVA");
            newTutor.setEmailVerificado(true);

            AuthIdentity localIdentity = new AuthIdentity(newTutor, AuthProvider.LOCAL, tutorEmail);
            newTutor.addIdentity(localIdentity);

            User saved = userRepository.save(newTutor);
            logger.info("[TUTOR FLOW] Cuenta de tutor creada exitosamente con contraseña aleatoria para {}", saved.getEmail());
            return saved;
        });

        // Generar token para que el tutor establezca su propia contraseña segura
        passwordResetTokenRepository.deleteByUser(tutorUser);
        String rawResetToken = tokenService.generateRawToken();
        String resetTokenHash = tokenService.hashToken(rawResetToken);
        Instant resetExpiry = Instant.now().plusSeconds(86400); // 24 horas

        PasswordResetToken resetToken = new PasswordResetToken(resetTokenHash, tutorUser, resetExpiry);
        passwordResetTokenRepository.save(resetToken);

        // Enviar correo de bienvenida y establecimiento de contraseña
        emailService.sendTutorAccountCreatedEmail(
                tutorUser.getEmail(),
                rawResetToken,
                tutorUser.getNombre(),
                solicitud.getAdolescenteNombre()
        );
    }

    @Override
    public void sendDirectoryToEmail(SendDirectoryRequest request) {
        emailService.sendDirectoryEmail(request.getEmail().trim().toLowerCase(), request.getNombre());
    }

    private SolicitudTutor findSolicitudByToken(String token) {
        if (token == null || token.isBlank()) {
            throw new InvalidTokenException("El token de solicitud no fue proporcionado.");
        }
        String tokenHash = tokenService.hashToken(token.trim());
        // Buscar por hash primero, o por token directo como respaldo
        return solicitudTutorRepository.findByTokenHash(tokenHash)
                .or(() -> solicitudTutorRepository.findByTokenHash(token.trim()))
                .orElseThrow(() -> new InvalidTokenException("La solicitud de tutor no fue encontrada o el token es inválido."));
    }

    private TutorFlowStatusResponse mapToResponse(SolicitudTutor entity) {
        TutorFlowStatusResponse res = new TutorFlowStatusResponse();
        res.setEstado(entity.getEstado());
        res.setEmailTutor(entity.getEmailTutor());
        res.setTelefonoTutor(entity.getTelefonoTutor());
        res.setAutorizaWhatsapp(entity.isAutorizaWhatsapp());
        res.setConsentimientoFirmado(entity.isConsentimientoFirmado());
        res.setConsentimientoFirmaNombre(entity.getConsentimientoFirmaNombre());
        res.setAdolescenteNombre(entity.getAdolescenteNombre());
        res.setAdolescenteFechaNacimiento(entity.getAdolescenteFechaNacimiento());
        res.setAdolescenteEdad(entity.getAdolescenteEdad());
        res.setAdolescenteEmail(entity.getAdolescenteEmail());
        res.setAdolescenteTieneDispositivo(entity.getAdolescenteTieneDispositivo());
        res.setAdolescenteNacionalidad(entity.getAdolescenteNacionalidad());
        res.setExpiresAt(entity.getExpiresAt());
        res.setReenviosCount(entity.getReenviosCount());

        if ("DERIVACION_PRIORITARIA".equalsIgnoreCase(entity.getEstado())) {
            res.setDerivacionTipo("PRIORITARIA");
        } else if ("DERIVACION_GENERAL".equalsIgnoreCase(entity.getEstado())) {
            res.setDerivacionTipo("GENERAL");
        } else {
            res.setDerivacionTipo("NONE");
        }

        res.setCuentaDesbloqueada("FINALIZADO_DESBLOQUEADO".equalsIgnoreCase(entity.getEstado()));
        return res;
    }
}

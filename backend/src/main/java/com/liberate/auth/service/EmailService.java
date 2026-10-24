package com.liberate.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:Libérate <soporte@luminar.top>}")
    private String mailFrom;

    @Value("${app.mail.frontend-url:http://localhost:8081}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envía el correo de verificación para validar la cuenta y habilitar el login.
     *
     * @param toEmail  Correo de destino
     * @param rawToken Token criptográfico de verificación
     */
    public void sendEmailVerificationEmail(String toEmail, String rawToken) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + rawToken;
        String subject = "Libérate - Valida tu cuenta para iniciar sesión";

        String htmlContent = buildVerificationEmailTemplate(toEmail, rawToken, verificationUrl);

        logger.info("[EMAIL SERVICE] Preparando envío de validación de correo a {}. Token: {}", toEmail, rawToken);
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Envía el correo de recuperación de contraseña.
     *
     * @param toEmail  Correo de destino
     * @param rawToken Token de un solo uso para restablecer contraseña
     */
    public void sendPasswordResetEmail(String toEmail, String rawToken) {
        String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;
        String subject = "Libérate - Restablecimiento de contraseña";

        String htmlContent = buildPasswordResetEmailTemplate(toEmail, rawToken, resetUrl);

        logger.info("[EMAIL SERVICE] Preparando envío de restablecimiento de contraseña a {}. Token: {}", toEmail, rawToken);
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Envía correo de invitación al tutor legal cuando un adolescente menor de edad intenta registrarse.
     */
    public void sendTutorInvitationEmail(String tutorEmail, String rawToken, String adolescentName) {
        String confirmUrl = frontendUrl + "/tutor-confirm?token=" + rawToken;
        String subject = "Libérate - Solicitud de consentimiento de tutor para " + adolescentName;

        String htmlContent = buildTutorInvitationEmailTemplate(tutorEmail, rawToken, adolescentName, confirmUrl);

        logger.info("[EMAIL SERVICE] Preparando envío de invitación a tutor {}. Adolescente: {}", tutorEmail, adolescentName);
        sendHtmlEmail(tutorEmail, subject, htmlContent);
    }

    /**
     * Envía correo al adolescente informando que su tutor completó el proceso y su cuenta está desbloqueada.
     */
    public void sendAdolescentUnlockedEmail(String adolescentEmail, String adolescentName) {
        String loginUrl = frontendUrl + "/login";
        String subject = "Libérate - ¡Tu cuenta ha sido autorizada y desbloqueada!";

        String htmlContent = buildAdolescentUnlockedEmailTemplate(adolescentEmail, adolescentName, loginUrl);

        logger.info("[EMAIL SERVICE] Preparando envío de notificación de desbloqueo a adolescente {}", adolescentEmail);
        sendHtmlEmail(adolescentEmail, subject, htmlContent);
    }

    /**
     * Envía correo al tutor/padre de familia notificándole la creación de su cuenta
     * y proporcionándole un enlace seguro para establecer su contraseña personal.
     */
    public void sendTutorAccountCreatedEmail(String tutorEmail, String rawToken, String tutorName, String adolescentName) {
        String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;
        String subject = "Libérate - Cuenta de tutor creada: Establece tu contraseña";
        String htmlContent = buildTutorAccountCreatedEmailTemplate(tutorEmail, rawToken, tutorName, adolescentName, resetUrl);

        logger.info("[EMAIL SERVICE] Enviando correo de bienvenida y establecimiento de contraseña a tutor {}. Token: {}", tutorEmail, rawToken);
        sendHtmlEmail(tutorEmail, subject, htmlContent);
    }

    /**
     * Envía el directorio de apoyo y atención psicológica en formato accesible por correo electrónico.
     */
    public void sendDirectoryEmail(String toEmail, String recipientName) {
        String subject = "Libérate - Directorio de instituciones de apoyo psicológico y emocional";
        String htmlContent = buildDirectoryEmailTemplate(toEmail, recipientName);

        logger.info("[EMAIL SERVICE] Preparando envío de directorio de apoyo a {}", toEmail);
        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Envía alerta interna de derivación prioritaria al equipo clínico ante situación de violencia o urgencia.
     */
    public void sendPriorityClinicalAlert(String tutorEmail, String tutorPhone, String adolescentName, Integer age) {
        String subject = "URGENTE: Derivación Prioritaria detectada en protocolo de tamizaje";
        String htmlContent = buildPriorityClinicalAlertTemplate(tutorEmail, tutorPhone, adolescentName, age);

        logger.warn("[EMAIL SERVICE CLINICAL ALERT] Derivación prioritaria para tutor {} (tel: {}), adolescente: {} ({} años)",
                tutorEmail, tutorPhone, adolescentName, age);
        sendHtmlEmail("soporte@luminar.top", subject, htmlContent);
    }

    /**
     * Método centralizado para el envío de correos vía Mailtrap SMTP (JavaMailSender).
     */
    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        if (mailSender == null || smtpUsername == null || smtpUsername.isBlank() || smtpUsername.contains("tu-mailtrap") || smtpUsername.contains("sandboxXXX")) {
            logger.warn("[EMAIL SERVICE] Servidor SMTP con Mailtrap no configurado en .env. Modo Simulación activo.");
            logger.info("[EMAIL SERVICE SIMULACIÓN] Para: {} | Asunto: {}", to, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML

            mailSender.send(message);
            logger.info("[EMAIL SERVICE] Correo enviado exitosamente vía Mailtrap SMTP a: {}", to);
        } catch (MessagingException e) {
            logger.error("[EMAIL SERVICE ERROR] Falló la creación o envío del mensaje MIME hacia {}: {}", to, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("[EMAIL SERVICE ERROR] Error inesperado al conectar con el servidor SMTP de Mailtrap: {}", e.getMessage(), e);
        }
    }

    // =========================================================================
    // PLANTILLAS HTML RESPONSIVAS (Sistema Serene Support)
    // =========================================================================

    private String buildVerificationEmailTemplate(String email, String token, String verificationUrl) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Valida tu cuenta</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; color: #2d3748; }
                .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #635979 0%, #4a3e61 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
                .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 36px 30px; }
                .greeting { font-size: 18px; font-weight: 600; color: #1a202c; margin-bottom: 12px; }
                .text { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px; }
                .token-box { background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
                .token-code { font-family: monospace; font-size: 18px; font-weight: 700; color: #635979; letter-spacing: 1px; word-break: break-all; }
                .button-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background-color: #635979; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 10px rgba(99, 89, 121, 0.25); }
                .footer { background-color: #fbf9f5; padding: 24px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Libérate</h1>
                  <p>Espacio seguro de bienestar y acompañamiento emocional</p>
                </div>
                <div class="content">
                  <div class="greeting">¡Hola!</div>
                  <p class="text">
                    Gracias por unirte a <strong>Libérate</strong>. Para activar tu cuenta, verificar tu inicio de sesión y acceder a los ejercicios y acompañamiento, por favor valida tu dirección de correo electrónico.
                  </p>
                  <div class="button-container">
                    <a href="{{VERIFICATION_URL}}" class="btn" target="_blank">Validar mi cuenta</a>
                  </div>
                  <p class="text" style="font-size: 13px; color: #718096;">
                    Si el botón no funciona, también puedes copiar este código de verificación en la app:
                  </p>
                  <div class="token-box">
                    <div class="token-code">{{TOKEN}}</div>
                  </div>
                  <p class="text" style="font-size: 13px; color: #a0aec0;">
                    Este enlace y token expiran en 24 horas. Si tú no creaste esta cuenta, puedes ignorar este mensaje de forma segura.
                  </p>
                </div>
                <div class="footer">
                  © 2026 Libérate (luminar.top) • Contacto: soporte@luminar.top
                </div>
              </div>
            </body>
            </html>
            """
            .replace("{{VERIFICATION_URL}}", verificationUrl)
            .replace("{{TOKEN}}", token);
    }

    private String buildPasswordResetEmailTemplate(String email, String token, String resetUrl) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Recupera tu contraseña</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; color: #2d3748; }
                .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #326578 0%, #1e3f4b 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
                .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 36px 30px; }
                .greeting { font-size: 18px; font-weight: 600; color: #1a202c; margin-bottom: 12px; }
                .text { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px; }
                .token-box { background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
                .token-code { font-family: monospace; font-size: 18px; font-weight: 700; color: #326578; letter-spacing: 1px; word-break: break-all; }
                .button-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background-color: #326578; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 10px rgba(50, 101, 120, 0.25); }
                .footer { background-color: #fbf9f5; padding: 24px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Libérate</h1>
                  <p>Restablecimiento de acceso seguro</p>
                </div>
                <div class="content">
                  <div class="greeting">Solicitud de cambio de contraseña</div>
                  <p class="text">
                    Hemos recibido una solicitud para restablecer la contraseña asociada a tu cuenta en <strong>Libérate</strong>. Haz clic en el botón a continuación para definir una nueva contraseña:
                  </p>
                  <div class="button-container">
                    <a href="{{RESET_URL}}" class="btn" target="_blank">Restablecer mi contraseña</a>
                  </div>
                  <p class="text" style="font-size: 13px; color: #718096;">
                    O ingresa este token de recuperación directamente en la aplicación:
                  </p>
                  <div class="token-box">
                    <div class="token-code">{{TOKEN}}</div>
                  </div>
                  <p class="text" style="font-size: 13px; color: #e53e3e; font-weight: 500;">
                    Por seguridad, este enlace es de un solo uso y expirará en 1 hora.
                  </p>
                  <p class="text" style="font-size: 13px; color: #a0aec0;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual no será modificada.
                  </p>
                </div>
                <div class="footer">
                  © 2026 Libérate (luminar.top) • Contacto: soporte@luminar.top
                </div>
              </div>
            </body>
            </html>
            """
            .replace("{{RESET_URL}}", resetUrl)
            .replace("{{TOKEN}}", token);
    }

    private String buildTutorInvitationEmailTemplate(String email, String token, String adolescentName, String confirmUrl) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Solicitud de tutor legal</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; color: #2d3748; }
                .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #635979 0%, #4a3e61 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
                .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 36px 30px; }
                .greeting { font-size: 18px; font-weight: 600; color: #1a202c; margin-bottom: 12px; }
                .text { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 20px; }
                .info-box { background-color: #f6f3f8; border-left: 4px solid #635979; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #4a5568; line-height: 1.5; }
                .token-box { background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
                .token-code { font-family: monospace; font-size: 18px; font-weight: 700; color: #635979; letter-spacing: 1px; word-break: break-all; }
                .button-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background-color: #635979; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 10px rgba(99, 89, 121, 0.25); }
                .footer { background-color: #fbf9f5; padding: 24px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Libérate</h1>
                  <p>UNAM · IPN · LABPSIIT · Protocolo PAPIME PE309026</p>
                </div>
                <div class="content">
                  <div class="greeting">Estimada madre, padre o tutor legal:</div>
                  <p class="text">
                    <strong>{{ADOLESCENT_NAME}}</strong> ha iniciado su registro para formar parte de la plataforma de bienestar y apoyo emocional <strong>Libérate</strong>.
                  </p>
                  <div class="info-box">
                    Al tratarse de una persona menor de edad y formar parte de un protocolo de investigación avalado por comités éticos institucionales, es indispensable contar con su consentimiento informado previo y completar un breve cuestionario de tamizaje.
                  </div>
                  <p class="text">
                    El proceso toma aproximadamente 10 a 15 minutos y se realiza de manera 100% confidencial y segura.
                  </p>
                  <div class="button-container">
                    <a href="{{CONFIRM_URL}}" class="btn" target="_blank">Continuar como tutor legal</a>
                  </div>
                  <p class="text" style="font-size: 13px; color: #718096;">
                    Si prefieres ingresar con tu código en la plataforma, introduce este identificador:
                  </p>
                  <div class="token-box">
                    <div class="token-code">{{TOKEN}}</div>
                  </div>
                  <p class="text" style="font-size: 13px; color: #a0aec0;">
                    Este enlace de consentimiento tiene una vigencia de 72 horas. Si usted no reconoce esta solicitud, puede desestimar este mensaje.
                  </p>
                </div>
                <div class="footer">
                  © 2026 Libérate (luminar.top) • Contacto ético y soporte: soporte@luminar.top
                </div>
              </div>
            </body>
            </html>
            """
            .replace("{{CONFIRM_URL}}", confirmUrl)
            .replace("{{TOKEN}}", token)
            .replace("{{ADOLESCENT_NAME}}", adolescentName);
    }

    private String buildAdolescentUnlockedEmailTemplate(String email, String adolescentName, String loginUrl) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Tu cuenta está lista</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; color: #2d3748; }
                .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #4a654e 0%, #2f4532 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
                .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 36px 30px; }
                .greeting { font-size: 18px; font-weight: 600; color: #1a202c; margin-bottom: 12px; }
                .text { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px; }
                .button-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background-color: #4a654e; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 10px rgba(74, 101, 78, 0.25); }
                .footer { background-color: #fbf9f5; padding: 24px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Libérate</h1>
                  <p>¡Bienvenido/a a tu espacio seguro!</p>
                </div>
                <div class="content">
                  <div class="greeting">¡Hola {{ADOLESCENT_NAME}}!</div>
                  <p class="text">
                    Te tenemos excelentes noticias: tu tutor legal ha completado exitosamente la confirmación y el consentimiento informado ético.
                  </p>
                  <p class="text">
                    Tu cuenta ha sido desbloqueada. Ahora puedes iniciar sesión en Libérate para completar tus cuestionarios iniciales y comenzar a utilizar todas las herramientas de respiración, registro emocional y bienestar.
                  </p>
                  <div class="button-container">
                    <a href="{{LOGIN_URL}}" class="btn" target="_blank">Iniciar sesión en Libérate</a>
                  </div>
                </div>
                <div class="footer">
                  © 2026 Libérate (luminar.top) • Contacto: soporte@luminar.top
                </div>
              </div>
            </body>
            </html>
            """
            .replace("{{LOGIN_URL}}", loginUrl)
            .replace("{{ADOLESCENT_NAME}}", adolescentName);
    }

    private String buildDirectoryEmailTemplate(String email, String recipientName) {
        String greeting = (recipientName != null && !recipientName.isBlank()) ? "Hola " + recipientName : "Estimado/a usuario/a";
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Directorio de apoyo psicológico</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; color: #2d3748; }
                .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #635979 0%, #4a3e61 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
                .content { padding: 30px; }
                .item { border-bottom: 1px solid #e2e8f0; padding: 16px 0; }
                .item:last-child { border-bottom: none; }
                .title { font-size: 16px; font-weight: 700; color: #2d3748; margin-bottom: 4px; }
                .phone { font-size: 15px; font-weight: 700; color: #635979; margin-bottom: 4px; }
                .desc { font-size: 13px; color: #718096; line-height: 1.4; }
                .footer { background-color: #fbf9f5; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Directorio Institucional de Apoyo Emocional</h1>
                  <p style="margin: 6px 0 0; opacity: 0.9;">Líneas gratuitas, confidenciales y con cobertura nacional</p>
                </div>
                <div class="content">
                  <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-top: 0;">
                    {{GREETING}}, ponemos a tu disposición los contactos de instituciones públicas y especializadas que ofrecen orientación psicológica profesional gratuita:
                  </p>
                  <div class="item">
                    <div class="title">Línea de la Vida (CONASAMA)</div>
                    <div class="phone">📞 800 911 2000</div>
                    <div class="desc">Atención telefónica gratuita las 24 horas del día, los 365 días del año para contención emocional y prevención del suicidio.</div>
                  </div>
                  <div class="item">
                    <div class="title">SAPTEL (Sistema de Apoyo Psicológico por Teléfono)</div>
                    <div class="phone">📞 55 5259 8121</div>
                    <div class="desc">Consejo psicológico e intervención en crisis las 24 horas, respaldado por la Cruz Roja Mexicana.</div>
                  </div>
                  <div class="item">
                    <div class="title">Atención Psicológica a Distancia UNAM</div>
                    <div class="phone">📞 55 5025 0855</div>
                    <div class="desc">Servicio de orientación psicológica especializada brindado por la Facultad de Psicología de la UNAM (Lunes a Viernes 8:00 a 18:00 hrs).</div>
                  </div>
                  <div class="item">
                    <div class="title">Emergencias Nacionales</div>
                    <div class="phone">🚨 911</div>
                    <div class="desc">Para situaciones con riesgo vital o peligro inminente a la integridad física.</div>
                  </div>
                </div>
                <div class="footer">
                  © 2026 Libérate (luminar.top) • Espacio UNAM / IPN / LABPSIIT
                </div>
              </div>
            </body>
            </html>
            """
            .replace("{{GREETING}}", greeting);
    }

    private String buildPriorityClinicalAlertTemplate(String tutorEmail, String tutorPhone, String adolescentName, Integer age) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <title>ALERTA CLÍNICA PRIORITARIA</title>
            </head>
            <body style="font-family: sans-serif; padding: 20px; background-color: #fff5f5; color: #742a2a;">
              <h2 style="color: #c53030;">ALERTA DE DERIVACIÓN PRIORITARIA (VIOLENCIA / CRISIS)</h2>
              <p>Se ha detectado una respuesta afirmativa en la pregunta de situación de violencia durante el tamizaje del protocolo:</p>
              <ul>
                <li><strong>Adolescente:</strong> %s (%s años)</li>
                <li><strong>Correo tutor:</strong> %s</li>
                <li><strong>WhatsApp / Teléfono tutor:</strong> %s</li>
                <li><strong>Compromiso mostrado al tutor:</strong> Contacto en menos de 24 horas</li>
              </ul>
              <p>Por favor proceder de acuerdo con el protocolo de contención y canalización urgente del equipo de investigación.</p>
            </body>
            </html>
            """.formatted(adolescentName, age != null ? age : "N/D", tutorEmail, tutorPhone != null ? tutorPhone : "N/D");
    }

    private String buildTutorAccountCreatedEmailTemplate(String email, String token, String tutorName, String adolescentName, String resetUrl) {
        String greeting = (tutorName != null && !tutorName.isBlank()) ? "Hola, " + tutorName : "Hola, estimado tutor/familiar";
        String adolescentRef = (adolescentName != null && !adolescentName.isBlank()) ? adolescentName : "tu adolescente a cargo";

        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bienvenido a Libérate - Cuenta de Tutor Creada</title>
              <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fbf9f5; color: #2d3748; }
                .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #635979 0%, #4a654e 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; }
                .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 36px 30px; }
                .greeting { font-size: 18px; font-weight: 600; color: #1a202c; margin-bottom: 12px; }
                .text { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 20px; }
                .token-box { background-color: #f7fafc; border: 2px dashed #cbd5e0; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
                .token-code { font-family: monospace; font-size: 18px; font-weight: 700; color: #635979; letter-spacing: 1px; word-break: break-all; }
                .button-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background-color: #635979; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 10px rgba(99, 89, 121, 0.25); }
                .footer { background-color: #fbf9f5; padding: 24px 30px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Libérate</h1>
                  <p>Acompañamiento y Bienestar Familiar</p>
                </div>
                <div class="content">
                  <div class="greeting">{{GREETING}}</div>
                  <p class="text">
                    Has completado y autorizado exitosamente el protocolo de consentimiento informado para <strong>{{ADOLESCENT_NAME}}</strong>.
                  </p>
                  <p class="text">
                    Hemos creado automáticamente tu cuenta en <strong>Libérate</strong> con el rol de <strong>Familia / Tutor</strong>. Para comenzar a usar la plataforma y definir tu contraseña personal segura, haz clic en el siguiente botón:
                  </p>
                  <div class="button-container">
                    <a href="{{RESET_URL}}" class="btn" target="_blank">Establecer mi contraseña</a>
                  </div>
                  <p class="text" style="font-size: 13px; color: #718096;">
                    O ingresa este token directamente en la pantalla de restablecer contraseña:
                  </p>
                  <div class="token-box">
                    <div class="token-code">{{TOKEN}}</div>
                  </div>
                  <p class="text" style="font-size: 13px; color: #718096;">
                    Una vez que elijas tu contraseña, podrás iniciar sesión con tu correo (<strong>{{EMAIL}}</strong>) para consultar recursos de bienestar familiar, guías de acompañamiento y módulos de orientación.
                  </p>
                </div>
                <div class="footer">
                  © 2026 Libérate (luminar.top) • Espacio UNAM / IPN / LABPSIIT
                </div>
              </div>
            </body>
            </html>
            """
            .replace("{{GREETING}}", greeting)
            .replace("{{ADOLESCENT_NAME}}", adolescentRef)
            .replace("{{RESET_URL}}", resetUrl)
            .replace("{{TOKEN}}", token)
            .replace("{{EMAIL}}", email);
    }
}


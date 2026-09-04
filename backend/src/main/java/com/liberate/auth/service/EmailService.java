package com.liberate.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendPasswordResetEmail(String email, String rawToken) {
        // In production, integrate with JavaMailSender / SendGrid / AWS SES.
        // For development and security, log token safely for testing.
        logger.info("[EMAIL SERVICE] Password reset token generated for {}: {}", email, rawToken);
    }

    public void sendEmailVerificationEmail(String email, String rawToken) {
        logger.info("[EMAIL SERVICE] Email verification token generated for {}: {}", email, rawToken);
    }
}

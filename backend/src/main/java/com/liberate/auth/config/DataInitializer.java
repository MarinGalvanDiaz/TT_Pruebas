package com.liberate.auth.config;

import com.liberate.auth.entity.AuthIdentity;
import com.liberate.auth.entity.AuthProvider;
import com.liberate.auth.entity.User;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("[DATA INITIALIZER] Verificando usuarios predeterminados de prueba y administración...");

        // Cuentas de Demo para el Frontend (Botones rápidos del LoginScreen)
        createIfNotExists("Adolescente Demo", "adolescente@liberate.org", "123456", UserRole.ADOLESCENTES);
        createIfNotExists("Familia Demo", "familia@liberate.org", "123456", UserRole.FAMILIAS);
        createIfNotExists("Psicólogo Demo", "psicologo@liberate.org", "123456", UserRole.PSICOLOGOS);

        // Cuentas de Dominio luminar.top
        createIfNotExists("Administrador General", "admin@luminar.top", "Password123!", UserRole.ADMIN);
        createIfNotExists("Equipo de Soporte", "soporte@luminar.top", "Password123!", UserRole.ADMIN);
        createIfNotExists("Sofía Gómez", "sofia@luminar.top", "Password123!", UserRole.ADOLESCENTES);
        createIfNotExists("Dr. Mateo Rivas", "mateo.psicologo@luminar.top", "Password123!", UserRole.PSICOLOGOS);

        // Compatibilidad con liberate.com
        createIfNotExists("Admin Liberate", "admin@liberate.com", "Password123!", UserRole.ADMIN);
        createIfNotExists("Sofía Liberate", "sofia@liberate.com", "Password123!", UserRole.ADOLESCENTES);

        logger.info("[DATA INITIALIZER] Inicialización de usuarios completada con éxito.");
    }

    private void createIfNotExists(String nombre, String email, String password, UserRole role) {
        String normalizedEmail = email.trim().toLowerCase();
        if (!userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            String hash = passwordEncoder.encode(password);
            User user = new User(nombre, normalizedEmail, hash, role);
            user.setEmailVerificado(true);
            user.addIdentity(new AuthIdentity(user, AuthProvider.LOCAL, normalizedEmail));
            userRepository.save(user);
            logger.info("[DATA INITIALIZER] Usuario creado: {} (Rol: {})", normalizedEmail, role);
        }
    }
}


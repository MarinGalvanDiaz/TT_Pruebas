-- =============================================================================
-- BASE DE DATOS: LIBÉRATE (liberatedb)
-- Plataforma de bienestar, apoyo emocional y salud mental
-- Compatible con: PostgreSQL 14+ / Spring Boot 3.2.x JPA
-- =============================================================================

-- Habilitar extensión para generación de identificadores UUID (opcional si la app genera UUID v4)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. ELIMINACIÓN PREVENTIVA DE TABLAS (Orden inverso de dependencias)
-- =============================================================================
DROP TABLE IF EXISTS cuestionarios_adolescente CASCADE;
DROP TABLE IF EXISTS solicitudes_tutor CASCADE;
DROP TABLE IF EXISTS registro_intentos_menores CASCADE;
DROP TABLE IF EXISTS testimonios_novedades CASCADE;
DROP TABLE IF EXISTS socios_aliados CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS ejercicios_pasos CASCADE;
DROP TABLE IF EXISTS ejercicios CASCADE;
DROP TABLE IF EXISTS registros_animo CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS email_verification_tokens CASCADE;
DROP TABLE IF EXISTS identidades_auth CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =============================================================================
-- 2. TABLAS DE AUTENTICACIÓN Y USUARIOS (Núcleo de Seguridad)
-- =============================================================================

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(50) NOT NULL DEFAULT 'ADOLESCENTES' 
        CHECK (role IN ('ADOLESCENTES', 'FAMILIAS', 'PSICOLOGOS', 'ADMIN')),
    estado_cuenta VARCHAR(50) NOT NULL DEFAULT 'ACTIVA'
        CHECK (estado_cuenta IN ('ACTIVA', 'PENDIENTE_DE_TUTOR', 'BLOQUEADA_MENOR')),
    evaluacion_inicial_completada BOOLEAN NOT NULL DEFAULT FALSE,
    edad INTEGER,
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_usuarios_email ON usuarios(email);

-- Tabla de Identidades de Autenticación Federada / Local (OAuth2 Google, Local, etc.)
CREATE TABLE identidades_auth (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('LOCAL', 'GOOGLE')),
    provider_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_provider_provider_id UNIQUE (provider, provider_id),
    CONSTRAINT uq_usuario_provider UNIQUE (usuario_id, provider)
);

CREATE INDEX idx_identidades_usuario_id ON identidades_auth(usuario_id);

-- Tokens de Verificación de Correo Electrónico (Login / Activación)
CREATE TABLE email_verification_tokens (
    id VARCHAR(36) PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expiry_date TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_verify_token_hash ON email_verification_tokens(token_hash);
CREATE INDEX idx_verify_usuario_id ON email_verification_tokens(usuario_id);

-- Tokens para Recuperación de Contraseña
CREATE TABLE password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expiry_date TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_reset_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_reset_usuario_id ON password_reset_tokens(usuario_id);

-- Tokens de Refresco de Sesión JWT (Rotación Continua)
CREATE TABLE refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expiry_date TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_refresh_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_usuario_id ON refresh_tokens(usuario_id);

-- Intentos de Registro Bloqueados para Menores de Edad
CREATE TABLE registro_intentos_menores (
    id VARCHAR(36) PRIMARY KEY,
    nombre_adolescente VARCHAR(150) NOT NULL,
    edad_adolescente INTEGER NOT NULL,
    email_tutor VARCHAR(150) NOT NULL,
    email_adolescente VARCHAR(150),
    motivo_bloqueo VARCHAR(100) NOT NULL DEFAULT 'registro_bloqueado_menor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registro_menores_email_tutor ON registro_intentos_menores(email_tutor);
CREATE INDEX idx_registro_menores_email_adolescente ON registro_intentos_menores(email_adolescente);

-- Solicitudes, Consentimiento Ético y Tamizaje de Tutores Legales
CREATE TABLE solicitudes_tutor (
    id VARCHAR(36) PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    email_tutor VARCHAR(150) NOT NULL,
    telefono_tutor VARCHAR(20),
    autoriza_whatsapp BOOLEAN NOT NULL DEFAULT FALSE,
    estado VARCHAR(50) NOT NULL DEFAULT 'INVITACION_ENVIADA' 
        CHECK (estado IN ('INVITACION_ENVIADA', 'DATOS_CONFIRMADOS', 'CONSENTIMIENTO_ACEPTADO', 'CONSENTIMIENTO_RECHAZADO', 'TAMIZAJE_COMPLETADO', 'DERIVACION_GENERAL', 'DERIVACION_PRIORITARIA', 'SINTOMAS_COMPLETADOS', 'FINALIZADO_DESBLOQUEADO')),
    consentimiento_firmado BOOLEAN NOT NULL DEFAULT FALSE,
    consentimiento_firma_nombre VARCHAR(150),
    consentimiento_fecha TIMESTAMPTZ,
    consentimiento_ip VARCHAR(50),
    
    -- Bloque A: Datos del adolescente
    adolescente_nombre VARCHAR(150),
    adolescente_fecha_nacimiento DATE,
    adolescente_edad INTEGER,
    adolescente_email VARCHAR(150),
    adolescente_tiene_dispositivo BOOLEAN,
    adolescente_nacionalidad VARCHAR(50) DEFAULT 'Mexicana',
    
    -- Bloque B: Tamizaje clínico (Valores: 'SI', 'NO', 'NO_SE')
    resp_neurodesarrollo VARCHAR(20),
    resp_atencion_actual VARCHAR(20),
    resp_otro_diagnostico VARCHAR(20),
    resp_violencia VARCHAR(20),
    
    -- Bloque Síntomas Pre (JSON de respuestas)
    respuestas_sintomas_json TEXT,
    
    -- Control de reenvíos y caducidad (72 horas, máx 3 reenvíos por día, cooldown 2 min)
    reenvios_count INTEGER NOT NULL DEFAULT 0,
    ultimo_reenvio_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Cuenta de usuario vinculada
    adolescente_usuario_id VARCHAR(36) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_solicitud_tutor_token ON solicitudes_tutor(token_hash);
CREATE INDEX idx_solicitud_tutor_email ON solicitudes_tutor(email_tutor);
CREATE INDEX idx_solicitud_tutor_adolescente_email ON solicitudes_tutor(adolescente_email);

-- Cuestionarios Iniciales de Evaluación Clínica para Adolescentes (CMASR-2, BAI-Y, EBIS, DERS-E)
CREATE TABLE cuestionarios_adolescente (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cmasr2_respuestas TEXT,
    cmasr2_score INTEGER,
    cmasr2_def_score INTEGER,
    cmasr2_inc_score INTEGER,
    baiy_respuestas TEXT,
    baiy_score INTEGER,
    ebis_respuestas TEXT,
    ebis_score INTEGER,
    ebis_bandera_roja BOOLEAN NOT NULL DEFAULT FALSE,
    derse_respuestas TEXT,
    derse_score INTEGER,
    derse_f1 INTEGER,
    derse_f2 INTEGER,
    derse_f3 INTEGER,
    derse_f4 INTEGER,
    instrumento_actual INTEGER NOT NULL DEFAULT 0,
    pregunta_actual INTEGER NOT NULL DEFAULT 0,
    estado_evaluacion VARCHAR(50) NOT NULL DEFAULT 'COMPLETADO'
        CHECK (estado_evaluacion IN ('COMPLETADO', 'ALERTA_CRITICA', 'EN_PROGRESO')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cuestionarios_usuario ON cuestionarios_adolescente(usuario_id);


-- =============================================================================
-- 3. TABLAS DE DOMINIO Y BIENESTAR EMOCIONAL (Libérate App)
-- =============================================================================

-- Registro Diario de Estado de Ánimo
CREATE TABLE registros_animo (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mood_usuario_fecha ON registros_animo(usuario_id, created_at DESC);

-- Ejercicios Guiados de Respiración y Calma
CREATE TABLE ejercicios (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('Aire', 'Calma', 'Cuerpo')),
    duration_seconds INTEGER NOT NULL DEFAULT 240,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pasos de los Ejercicios Guiados
CREATE TABLE ejercicios_pasos (
    id VARCHAR(36) PRIMARY KEY,
    ejercicio_id VARCHAR(36) NOT NULL REFERENCES ejercicios(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    description TEXT NOT NULL
);

CREATE INDEX idx_ejercicios_pasos_ejercicio ON ejercicios_pasos(ejercicio_id, step_order ASC);

-- Preguntas Frecuentes (FAQs)
CREATE TABLE faqs (
    id VARCHAR(36) PRIMARY KEY,
    category VARCHAR(100),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- Testimonios y Novedades de la Comunidad
CREATE TABLE testimonios_novedades (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Experiencia', 'Novedad')),
    content TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50),
    avatar_color VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Organizaciones y Socios Aliados
CREATE TABLE socios_aliados (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    logo_text VARCHAR(50) NOT NULL,
    description TEXT,
    website_url VARCHAR(255)
);

-- =============================================================================
-- 4. DATOS INICIALES DE PRUEBA Y SEMILLA (Seed Data)
-- =============================================================================

-- Contraseña encriptada con BCrypt: '$2a$10$wK1qA58i8j9tWvJzF8B2xeXz0YV5QdO9I3qY2zJ4oG1lB2c3d4e5f' -> 'Password123!'
INSERT INTO usuarios (id, nombre, email, password_hash, email_verificado, role)
VALUES 
('usr-admin-001', 'Administrador General', 'admin@luminar.top', '$2a$10$wK1qA58i8j9tWvJzF8B2xeXz0YV5QdO9I3qY2zJ4oG1lB2c3d4e5f', TRUE, 'ADMIN'),
('usr-soporte-002', 'Equipo de Soporte', 'soporte@luminar.top', '$2a$10$wK1qA58i8j9tWvJzF8B2xeXz0YV5QdO9I3qY2zJ4oG1lB2c3d4e5f', TRUE, 'ADMIN'),
('usr-demo-003', 'Sofía Gómez', 'sofia@luminar.top', '$2a$10$wK1qA58i8j9tWvJzF8B2xeXz0YV5QdO9I3qY2zJ4oG1lB2c3d4e5f', TRUE, 'ADOLESCENTES'),
('usr-demo-004', 'Dr. Mateo Rivas', 'mateo.psicologo@luminar.top', '$2a$10$wK1qA58i8j9tWvJzF8B2xeXz0YV5QdO9I3qY2zJ4oG1lB2c3d4e5f', TRUE, 'PSICOLOGOS');

INSERT INTO identidades_auth (id, usuario_id, provider, provider_id)
VALUES 
('id-auth-001', 'usr-admin-001', 'LOCAL', 'admin@luminar.top'),
('id-auth-002', 'usr-soporte-002', 'LOCAL', 'soporte@luminar.top'),
('id-auth-003', 'usr-demo-003', 'LOCAL', 'sofia@luminar.top'),
('id-auth-004', 'usr-demo-004', 'LOCAL', 'mateo.psicologo@luminar.top');

-- Ejercicio Inicial (Respiración Táctica Cuadrada 4-4-4-4)
INSERT INTO ejercicios (id, title, subtitle, category, duration_seconds)
VALUES ('ex-001', 'Respiración Cuadrada', '4 segundos inhalar, 4 mantener, 4 exhalar y 4 descansar', 'Aire', 240);

INSERT INTO ejercicios_pasos (id, ejercicio_id, step_order, description)
VALUES 
('step-001', 'ex-001', 1, 'Inhala profundamente por la nariz durante 4 segundos'),
('step-002', 'ex-001', 2, 'Sostén el aire en tus pulmones durante 4 segundos'),
('step-003', 'ex-001', 3, 'Exhala suavemente por la boca durante 4 segundos'),
('step-004', 'ex-001', 4, 'Mantén el vacío relajando los hombros durante 4 segundos');

-- Preguntas Frecuentes Iniciales
INSERT INTO faqs (id, category, question, answer, display_order)
VALUES 
('faq-001', 'Privacidad', '¿Mis datos y registros emocionales son confidenciales?', 'Sí, la información compartida y tus registros de estado de ánimo están encriptados y protegidos bajo rigurosos protocolos de privacidad.', 1),
('faq-002', 'Uso', '¿Tiene algún costo usar los ejercicios de respiración?', 'No, todos los ejercicios de regulación emocional y de respiración son completamente gratuitos y accesibles para toda la comunidad.', 2),
('faq-003', 'Atención', '¿Qué hago si me encuentro en una situación de crisis urgente?', 'En Libérate dispones de un botón de emergencia directo para contactar a las líneas de atención psicológica y de ayuda inmediata de tu país.', 3);

-- Testimonios y Novedades Iniciales
INSERT INTO testimonios_novedades (id, type, content, author, role, icon_name, avatar_color)
VALUES 
('test-001', 'Experiencia', 'Los ejercicios de respiración me han ayudado a calmar la ansiedad antes de mis exámenes escolares.', 'Valentina M.', 'Adolescente (16 años)', 'heart', '#d1c4e9'),
('test-002', 'Experiencia', 'Poder consultar con psicólogos verificados y tener herramientas familiares nos devolvió la armonía en casa.', 'Carlos R.', 'Padre de familia', 'people', '#b5e7fe'),
('test-003', 'Novedad', 'Lanzamos nuevas sesiones de mindfulness y ejercicios de grounding para manejo de estrés cotidiano.', 'Equipo Libérate', 'Comunidad y Bienestar', 'sparkles', '#b4d2b6');

-- Socios Aliados
INSERT INTO socios_aliados (id, name, logo_text, description, website_url)
VALUES 
('partner-001', 'UNICEF Bienestar Joven', 'UNICEF', 'Alianza para la difusión y fomento de salud mental infantil y juvenil.', 'https://www.unicef.org'),
('partner-002', 'Federación de Psicología', 'FEPRA', 'Validación clínica y ética de contenidos y profesionales registrados.', 'https://www.psicologos.org');

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================


# Libérate - Backend Authentication Service (Spring Boot 3)

Servicio de autenticación y seguridad preparado para producción con **Spring Boot 3**, **Spring Security**, **JPA**, **JWT**, verificación criptográfica de **Google ID Tokens** y protección contra fuerza bruta.

---

## 🚀 Características Implementadas

1. **Autenticación Tradicional:**
   - Registro con `POST /api/auth/register` (hashing BCrypt 12 rounds, validación Jakarta).
   - Inicio de sesión con `POST /api/auth/login` (respuestas genéricas para evitar enumeración de usuarios).
2. **Google Sign-In:**
   - `POST /api/auth/google` con verificación criptográfica de firma RSA, issuer, expiration y audience contra las claves públicas oficiales de Google.
   - Vinculación inteligente de identidades a usuarios locales existentes mediante `provider` y `provider_id` único.
3. **Gestión de Sesión con JWT:**
   - Access Token de corta duración (15 min) firmado con HMAC-SHA256.
   - Refresh Token (64 bytes seguros, almacenados únicamente como hash SHA-256 en la base de datos).
   - Rotación automática de Refresh Tokens en `POST /api/auth/refresh`.
   - Cierre de sesión individual (`POST /api/auth/logout`) y revocación global (`POST /api/auth/logout-all`).
4. **Protección y Rate Limiting:**
   - Servicio thread-safe con ventana deslizante (5 intentos fallidos / 15 minutos).
5. **Recuperación de Contraseña y Verificación:**
   - `POST /api/auth/forgot-password` (respuestas genéricas de privacidad).
   - `POST /api/auth/reset-password` (tokens de un solo uso con expiración y hash SHA-256).
   - `POST /api/auth/verify-email`.

---

## 📦 Ejecución y Pruebas

### 1. Variables de entorno
Crea un archivo `.env` o exporta las variables:
```bash
export JWT_SECRET=dGhpcy1pcy1hLXZlcnktc2VjdXJlLTI1Ni1iaXQtc2VjcmV0LWtleS1mb3ItbGliZXJhdGUtYXBw
export GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
```

### 2. Compilación y Ejecución
```bash
mvn clean spring-boot:run
```

### 3. Ejecutar Pruebas Unitarias e Integración
```bash
mvn test
```

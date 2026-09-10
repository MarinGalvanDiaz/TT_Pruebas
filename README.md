# Libérate - Plataforma de Bienestar Emocional

Proyecto integral multiplataforma compuesto por:
1. **Frontend (`frontend/`)**: Aplicación en React Native con Expo (iOS, Android y Web) con interfaz basada en el sistema de diseño Serene Support.
2. **Backend (`backend/`)**: API REST de alto rendimiento en Spring Boot 3 con Spring Security, JWT, autenticación OAuth2 con Google y servicio de mensajería SMTP con Mailgun.
3. **Base de Datos (`schema.sql`)**: Esquema relacional optimizado para PostgreSQL con soporte para usuarios, identidades federadas, tokens criptográficos, ejercicios de regulación emocional y seguimiento de estado de ánimo.

---

## 📁 Estructura del Repositorio

```text
.
├── backend/                  # Servicio REST en Spring Boot 3.2
│   ├── mvnw.cmd              # Wrapper de Maven para Windows
│   ├── mvnw                  # Wrapper de Maven para Linux/macOS
│   ├── pom.xml               # Configuración de dependencias Maven
│   ├── .env.example          # Variables de entorno de ejemplo (DB, Mailgun, JWT)
│   └── src/                  # Código fuente Java y recursos
├── frontend/                 # Aplicación móvil y web en React Native + Expo
│   ├── App.tsx               # Punto de entrada de la UI
│   ├── package.json          # Dependencias y scripts de Expo
│   ├── .env.example          # Variables de entorno del frontend
│   └── src/                  # Componentes, pantallas, contextos y navegación
└── schema.sql                # Script de base de datos PostgreSQL con datos semilla
```

---

## 🚀 Puesta en Marcha

### 1. Base de Datos (PostgreSQL)
Ejecuta el script `schema.sql` en tu instancia de PostgreSQL:
```bash
psql -U postgres -d liberatedb -f schema.sql
```

### 2. Backend (Spring Boot)
1. Navega a `backend/`:
   ```bash
   cd backend
   ```
2. Copia `.env.example` a `.env` y configura tus credenciales (Base de datos, Mailgun API Key y SMTP):
   ```bash
   cp .env.example .env
   ```
3. Ejecuta el backend con el wrapper de Maven:
   - **En Windows:**
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - **En Linux/macOS:**
     ```bash
     ./mvnw spring-boot:run
     ```

### 3. Frontend (React Native + Expo)
1. Navega a `frontend/`:
   ```bash
   cd frontend
   ```
2. Inicia la aplicación:
   ```bash
   npm run web      # Para navegador web
   npm run android  # Para emulador o dispositivo Android
   npm run ios      # Para simulador iOS
   ```

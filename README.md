# Libérate Frontend (React Native + Expo para Móvil y Web)

Aplicación multiplataforma (iOS, Android y Web) para la plataforma de bienestar y apoyo emocional **Libérate**, desarrollada con **React Native** y **Expo**, con diseño fiel al sistema **Serene Support** extraído de **Stitch**, y arquitectura preparada para consumir un backend en **Spring Boot**.

---

## 🎨 Sistema de Diseño (Serene Support)

El diseño está centrado en la seguridad psicológica, accesibilidad y calidez táctil:
- **Colores primarios:** Lavanda (`#635979`, `#d1c4e9`) para áreas principales y acciones.
- **Colores secundarios:** Azul cielo (`#326578`, `#b5e7fe`) para acompañamiento y progreso.
- **Colores terciarios:** Verde menta (`#4a654e`, `#b4d2b6`) para estados de éxito y calma.
- **Canvas:** Fondo cálido (`#fbf9f5`) que reduce la fatiga visual.
- **Micro-interacciones:** Botones elásticos con degradado (`linear-gradient`), sombras suaves (`soft-shadow`) y selección de perfiles con mascotas ilustradas.

---

## 📁 Estructura del Proyecto

```text
src/
├── api/                      # Capa de integración con Spring Boot
│   ├── client.ts             # Cliente Axios configurado con interceptor JWT
│   └── endpoints.ts          # Definición de rutas REST (/api/v1/auth/login, etc.)
├── components/               # Componentes modulares y reutilizables
│   ├── common/               # GradientButton, FloatingInput, etc.
│   ├── layout/               # TopAppBar, WebHeader, Footer
│   └── modules/              # ProfileSelector, VideoPreviewCard, FaqAccordion, NewsCarousel
├── context/                  # AuthContext (Usuario, Rol, Token, Login, Registro)
├── navigation/               # RootNavigator (React Navigation Stack + Bottom Tabs)
├── screens/                  # Pantallas de la aplicación
│   ├── HomeScreen.tsx        # Bienvenida / Landing con Video, FAQs y Novedades
│   ├── LoginScreen.tsx       # Ingreso con selector de perfiles (Adolescentes, Familias, Psicólogos, Admin)
│   ├── RegisterScreen.tsx    # Registro de cuenta
│   ├── BreathingScreen.tsx   # Ejercicio táctil de respiración 4-4-4
│   └── ProgressScreen.tsx    # Seguimiento emocional diario y resumen semanal
├── theme/                    # Tokens de diseño (colors, typography, spacing, shadows)
├── types/                    # DTOs y modelos tipados de Spring Boot
└── services/                 # Servicios de negocio (AuthService, ContentService)
```

---

## 🚀 Ejecución del Proyecto

### 1. Requisitos
- Node.js 18+ instalado.

### 2. Iniciar en Web (Navegador)
```bash
npm run web
```

### 3. Iniciar en Móvil (Expo Go / Emulador)
```bash
npm run android
# o
npm run ios
```

---

## 🔌 Conexión con Backend Spring Boot

La aplicación está lista para comunicarse con los controladores REST de Spring Boot:
- Configura la URL base en el archivo `.env`:
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
  ```
- **Fallback Simulado (Mock Mode):** Si el servidor Spring Boot no está levantado en el momento de la prueba, la aplicación cambia de forma transparente al modo simulado con usuarios de prueba para que puedas explorar todas las pantallas y flujos de inmediato.

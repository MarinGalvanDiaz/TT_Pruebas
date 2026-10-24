# =============================================================================
# Stage 1: Build Expo SDK 57 Web Bundle with Node.js
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using clean package-lock sync
COPY package*.json ./
RUN npm ci

# Copy application source files (ignoring files specified in .dockerignore)
COPY . .

# Build-time environment variables for Expo Web
ARG EXPO_PUBLIC_API_URL=/api
ARG EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=""
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}
ENV EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=${EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID}

# Export static web bundle into /app/dist
RUN npx expo export --platform web

# =============================================================================
# Stage 2: Lightweight Nginx Alpine Web Server
# =============================================================================
FROM nginx:alpine AS runner

# Remove default Nginx website configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy exported static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


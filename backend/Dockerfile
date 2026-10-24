# =============================================================================
# Stage 1: Build JAR with Maven & Eclipse Temurin 17
# =============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# =============================================================================
# Stage 2: Minimal Production JRE Runtime
# =============================================================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Install curl and wget for healthchecks and create non-root user
RUN apk add --no-cache curl wget && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

# Configure quick cryptographic entropy source and run application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]


package com.liberate.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(AuthApplication.class, args);
    }

    private static void loadDotEnv() {
        java.nio.file.Path[] potentialPaths = new java.nio.file.Path[] {
            java.nio.file.Paths.get(".env"),
            java.nio.file.Paths.get("backend", ".env"),
            java.nio.file.Paths.get("..", "backend", ".env")
        };

        for (java.nio.file.Path path : potentialPaths) {
            if (java.nio.file.Files.exists(path)) {
                try {
                    java.util.List<String> lines = java.nio.file.Files.readAllLines(path);
                    for (String rawLine : lines) {
                        String line = rawLine.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    System.out.println("[AuthApplication] Variables de entorno cargadas exitosamente desde: " + path.toAbsolutePath());
                    break;
                } catch (Exception e) {
                    System.err.println("[AuthApplication] Advertencia al leer archivo .env: " + e.getMessage());
                }
            }
        }
    }
}

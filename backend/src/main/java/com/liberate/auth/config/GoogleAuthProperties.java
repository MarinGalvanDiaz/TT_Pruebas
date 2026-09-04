package com.liberate.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.google")
public class GoogleAuthProperties {

    private String clientId = "your-google-client-id.apps.googleusercontent.com";
    private List<String> additionalClientIds = new ArrayList<>();

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public List<String> getAdditionalClientIds() {
        return additionalClientIds;
    }

    public void setAdditionalClientIds(List<String> additionalClientIds) {
        this.additionalClientIds = additionalClientIds;
    }

    public List<String> getAllAllowedClientIds() {
        List<String> all = new ArrayList<>();
        if (clientId != null && !clientId.isBlank()) {
            all.add(clientId.trim());
        }
        if (additionalClientIds != null) {
            for (String id : additionalClientIds) {
                if (id != null && !id.isBlank()) {
                    all.add(id.trim());
                }
            }
        }
        return all;
    }
}

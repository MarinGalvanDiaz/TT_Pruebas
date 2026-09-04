package com.liberate.auth.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "identidades_auth", uniqueConstraints = {
    @UniqueConstraint(name = "uq_provider_provider_id", columnNames = {"provider", "provider_id"}),
    @UniqueConstraint(name = "uq_usuario_provider", columnNames = {"usuario_id", "provider"})
})
public class AuthIdentity {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", length = 50, nullable = false)
    private AuthProvider provider;

    @Column(name = "provider_id", length = 255, nullable = false)
    private String providerId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public AuthIdentity() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    public AuthIdentity(User user, AuthProvider provider, String providerId) {
        this();
        this.user = user;
        this.provider = provider;
        this.providerId = providerId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

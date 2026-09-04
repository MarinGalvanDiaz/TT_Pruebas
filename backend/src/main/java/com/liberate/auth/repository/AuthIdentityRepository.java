package com.liberate.auth.repository;

import com.liberate.auth.entity.AuthIdentity;
import com.liberate.auth.entity.AuthProvider;
import com.liberate.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthIdentityRepository extends JpaRepository<AuthIdentity, String> {
    Optional<AuthIdentity> findByProviderAndProviderId(AuthProvider provider, String providerId);
    Optional<AuthIdentity> findByUserAndProvider(User user, AuthProvider provider);
    List<AuthIdentity> findByUserId(String userId);
}

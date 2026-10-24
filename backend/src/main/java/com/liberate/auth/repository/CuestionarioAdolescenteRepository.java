package com.liberate.auth.repository;

import com.liberate.auth.entity.CuestionarioAdolescente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CuestionarioAdolescenteRepository extends JpaRepository<CuestionarioAdolescente, String> {

    Optional<CuestionarioAdolescente> findTopByUserIdOrderByCreatedAtDesc(String userId);

    boolean existsByUserId(String userId);
}


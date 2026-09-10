package com.liberate.auth.repository;

import com.liberate.auth.entity.SolicitudTutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SolicitudTutorRepository extends JpaRepository<SolicitudTutor, String> {
    Optional<SolicitudTutor> findByTokenHash(String tokenHash);
    Optional<SolicitudTutor> findFirstByEmailTutorOrderByCreatedAtDesc(String emailTutor);
    Optional<SolicitudTutor> findFirstByAdolescenteEmailOrderByCreatedAtDesc(String adolescenteEmail);
}


package com.liberate.auth.repository;

import com.liberate.auth.entity.RegistroIntentoMenor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistroIntentoMenorRepository extends JpaRepository<RegistroIntentoMenor, String> {
    List<RegistroIntentoMenor> findByEmailTutor(String emailTutor);
    List<RegistroIntentoMenor> findByEmailAdolescente(String emailAdolescente);
}


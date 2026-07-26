package com.logitrackpro.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.logitrackpro.api.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);
}

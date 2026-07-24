package com.logitrackpro.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.logitrackpro.api.model.Viagem;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {
}

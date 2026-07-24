package com.logitrackpro.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.logitrackpro.api.model.Manutencao;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {
}

package com.logitrackpro.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.logitrackpro.api.model.Veiculo;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
}

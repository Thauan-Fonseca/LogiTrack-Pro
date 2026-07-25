package com.logitrackpro.api.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.logitrackpro.api.model.Viagem;

public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    @Query(value = """
        SELECT COALESCE(SUM(km_percorrida), 0)
        FROM viagens
        WHERE (:veiculoId IS NULL OR veiculo_id = CAST(:veiculoId AS BIGINT))
        """, nativeQuery = true)
    BigDecimal calcularTotalKm(@Param("veiculoId") Long veiculoId);
}

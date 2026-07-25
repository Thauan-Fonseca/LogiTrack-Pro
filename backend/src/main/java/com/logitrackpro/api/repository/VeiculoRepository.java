package com.logitrackpro.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.logitrackpro.api.model.Veiculo;
import com.logitrackpro.api.repository.projection.RankingUtilizacaoProjection;
import com.logitrackpro.api.repository.projection.VolumeCategoriaProjection;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

    @Query(value = """
        SELECT v.tipo AS categoria, COUNT(t.id) AS "quantidadeViagens"
        FROM veiculos v LEFT JOIN viagens t ON t.veiculo_id = v.id
        GROUP BY v.tipo
        ORDER BY v.tipo
        """, nativeQuery = true)
    List<VolumeCategoriaProjection> volumePorCategoria();

    @Query(value = """
        SELECT v.id AS "veiculoId", v.placa AS placa, v.modelo AS modelo,
               COALESCE(SUM(t.km_percorrida), 0) AS "kmAcumulado"
        FROM veiculos v LEFT JOIN viagens t ON t.veiculo_id = v.id
        GROUP BY v.id, v.placa, v.modelo
        ORDER BY "kmAcumulado" DESC
        LIMIT 5
        """, nativeQuery = true)
    List<RankingUtilizacaoProjection> rankingUtilizacao();
}

package com.logitrackpro.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.logitrackpro.api.model.Manutencao;
import com.logitrackpro.api.repository.projection.ProjecaoFinanceiraProjection;
import com.logitrackpro.api.repository.projection.ProximaManutencaoProjection;

public interface ManutencaoRepository extends JpaRepository<Manutencao, Long> {

    @Query(value = """
        SELECT m.id AS id, m.veiculo_id AS "veiculoId", v.placa AS placa, v.modelo AS modelo,
               m.data_inicio AS "dataInicio", m.tipo_servico AS "tipoServico",
               m.custo_estimado AS "custoEstimado", m.status AS status
        FROM manutencoes m JOIN veiculos v ON v.id = m.veiculo_id
        WHERE m.status <> 'CONCLUIDA'
        ORDER BY m.data_inicio ASC
        LIMIT 5
        """, nativeQuery = true)
    List<ProximaManutencaoProjection> proximasManutencoes();

    @Query(value = """
        SELECT COALESCE(SUM(custo_estimado), 0) AS "custoTotalEstimado",
               COUNT(*) AS "quantidadeManutencoes"
        FROM manutencoes
        WHERE date_trunc('month', data_inicio) = date_trunc('month', CURRENT_DATE)
        """, nativeQuery = true)
    List<ProjecaoFinanceiraProjection> projecaoFinanceiraMesAtual();
}

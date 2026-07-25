package com.logitrackpro.api.dto.dashboard;

import java.util.List;

public record DashboardResponseDTO(
    KmTotalDTO kmTotal,
    List<VolumeCategoriaDTO> volumePorCategoria,
    List<ProximaManutencaoDTO> proximasManutencoes,
    List<RankingUtilizacaoDTO> rankingUtilizacao,
    ProjecaoFinanceiraDTO projecaoFinanceiraMesAtual
) {
}

package com.logitrackpro.api.dto.dashboard;

import java.math.BigDecimal;

public record RankingUtilizacaoDTO(
    Long veiculoId,
    String placa,
    String modelo,
    BigDecimal kmAcumulado
) {
}

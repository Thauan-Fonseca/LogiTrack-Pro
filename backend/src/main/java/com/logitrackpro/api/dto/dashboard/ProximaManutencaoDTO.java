package com.logitrackpro.api.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProximaManutencaoDTO(
    Long id,
    Long veiculoId,
    String placa,
    String modelo,
    LocalDate dataInicio,
    String tipoServico,
    BigDecimal custoEstimado,
    String status
) {
}

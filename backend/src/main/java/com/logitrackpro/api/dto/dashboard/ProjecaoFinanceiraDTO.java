package com.logitrackpro.api.dto.dashboard;

import java.math.BigDecimal;

public record ProjecaoFinanceiraDTO(
    BigDecimal custoTotalEstimado,
    Long quantidadeManutencoes
) {
}

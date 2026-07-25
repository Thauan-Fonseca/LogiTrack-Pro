package com.logitrackpro.api.repository.projection;

import java.math.BigDecimal;

public interface ProjecaoFinanceiraProjection {
    BigDecimal getCustoTotalEstimado();
    Long getQuantidadeManutencoes();
}

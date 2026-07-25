package com.logitrackpro.api.repository.projection;

import java.math.BigDecimal;

public interface RankingUtilizacaoProjection {
    Long getVeiculoId();
    String getPlaca();
    String getModelo();
    BigDecimal getKmAcumulado();
}

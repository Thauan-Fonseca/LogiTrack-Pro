package com.logitrackpro.api.repository.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ProximaManutencaoProjection {
    Long getId();
    Long getVeiculoId();
    String getPlaca();
    String getModelo();
    LocalDate getDataInicio();
    String getTipoServico();
    BigDecimal getCustoEstimado();
    String getStatus();
}

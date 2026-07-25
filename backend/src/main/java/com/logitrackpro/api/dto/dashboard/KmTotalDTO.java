package com.logitrackpro.api.dto.dashboard;

import java.math.BigDecimal;

public record KmTotalDTO(
    BigDecimal totalKm,
    Long veiculoId
) {
}

package com.logitrackpro.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ViagemResponseDTO(
    Long id,
    VeiculoResponseDTO veiculo,
    LocalDateTime dataSaida,
    LocalDateTime dataChegada,
    String origem,
    String destino,
    BigDecimal kmPercorrida
) {
}

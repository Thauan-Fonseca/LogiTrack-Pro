package com.logitrackpro.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ViagemRequestDTO(
    @NotNull(message = "Selecione o veículo") Long veiculoId,

    @NotNull(message = "Informe a data/hora de saída") LocalDateTime dataSaida,

    LocalDateTime dataChegada,

    @NotBlank(message = "Informe a cidade de origem")
    @Size(max = 100, message = "Origem deve ter no máximo 100 caracteres")
    String origem,

    @NotBlank(message = "Informe a cidade de destino")
    @Size(max = 100, message = "Destino deve ter no máximo 100 caracteres")
    String destino,

    @PositiveOrZero(message = "Quilometragem não pode ser negativa")
    BigDecimal kmPercorrida
) {
}

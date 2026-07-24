package com.logitrackpro.api.dto;

import com.logitrackpro.api.model.TipoVeiculo;

public record VeiculoResponseDTO(
    Long id,
    String placa,
    String modelo,
    TipoVeiculo tipo,
    Integer ano
) {
}

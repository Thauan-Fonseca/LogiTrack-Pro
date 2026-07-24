package com.logitrackpro.api.mapper;

import com.logitrackpro.api.dto.VeiculoResponseDTO;
import com.logitrackpro.api.model.Veiculo;

public class VeiculoMapper {

    private VeiculoMapper() {
    }

    public static VeiculoResponseDTO toResponse(Veiculo veiculo) {
        return new VeiculoResponseDTO(
            veiculo.getId(),
            veiculo.getPlaca(),
            veiculo.getModelo(),
            veiculo.getTipo(),
            veiculo.getAno()
        );
    }
}

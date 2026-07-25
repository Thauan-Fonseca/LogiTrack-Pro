package com.logitrackpro.api.mapper;

import com.logitrackpro.api.dto.ViagemRequestDTO;
import com.logitrackpro.api.dto.ViagemResponseDTO;
import com.logitrackpro.api.model.Veiculo;
import com.logitrackpro.api.model.Viagem;

public class ViagemMapper {

    private ViagemMapper() {
    }

    public static ViagemResponseDTO toResponse(Viagem viagem) {
        return new ViagemResponseDTO(
            viagem.getId(),
            VeiculoMapper.toResponse(viagem.getVeiculo()),
            viagem.getDataSaida(),
            viagem.getDataChegada(),
            viagem.getOrigem(),
            viagem.getDestino(),
            viagem.getKmPercorrida()
        );
    }

    public static Viagem toEntity(ViagemRequestDTO dto, Veiculo veiculo) {
        Viagem viagem = new Viagem();
        aplicarDados(viagem, dto, veiculo);
        return viagem;
    }

    public static void aplicarDados(Viagem viagem, ViagemRequestDTO dto, Veiculo veiculo) {
        viagem.setVeiculo(veiculo);
        viagem.setDataSaida(dto.dataSaida());
        viagem.setDataChegada(dto.dataChegada());
        viagem.setOrigem(dto.origem());
        viagem.setDestino(dto.destino());
        viagem.setKmPercorrida(dto.kmPercorrida());
    }
}

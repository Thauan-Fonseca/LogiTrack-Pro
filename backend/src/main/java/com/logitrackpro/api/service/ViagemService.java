package com.logitrackpro.api.service;

import java.util.List;

import com.logitrackpro.api.dto.ViagemRequestDTO;
import com.logitrackpro.api.dto.ViagemResponseDTO;

public interface ViagemService {

    List<ViagemResponseDTO> listarTodos();

    ViagemResponseDTO buscarPorId(Long id);

    ViagemResponseDTO criar(ViagemRequestDTO dto);

    ViagemResponseDTO atualizar(Long id, ViagemRequestDTO dto);

    void deletar(Long id);
}

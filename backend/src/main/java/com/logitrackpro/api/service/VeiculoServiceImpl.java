package com.logitrackpro.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.logitrackpro.api.dto.VeiculoResponseDTO;
import com.logitrackpro.api.mapper.VeiculoMapper;
import com.logitrackpro.api.repository.VeiculoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VeiculoServiceImpl implements VeiculoService {

    private final VeiculoRepository veiculoRepository;

    @Override
    public List<VeiculoResponseDTO> listarTodos() {
        return veiculoRepository.findAll()
            .stream()
            .map(VeiculoMapper::toResponse)
            .toList();
    }
}

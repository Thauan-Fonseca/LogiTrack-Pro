package com.logitrackpro.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.logitrackpro.api.dto.ViagemRequestDTO;
import com.logitrackpro.api.dto.ViagemResponseDTO;
import com.logitrackpro.api.exception.BusinessRuleException;
import com.logitrackpro.api.exception.ResourceNotFoundException;
import com.logitrackpro.api.mapper.ViagemMapper;
import com.logitrackpro.api.model.Veiculo;
import com.logitrackpro.api.model.Viagem;
import com.logitrackpro.api.repository.VeiculoRepository;
import com.logitrackpro.api.repository.ViagemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ViagemServiceImpl implements ViagemService {

    private final ViagemRepository viagemRepository;
    private final VeiculoRepository veiculoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ViagemResponseDTO> listarTodos() {
        return viagemRepository.findAll()
            .stream()
            .map(ViagemMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ViagemResponseDTO buscarPorId(Long id) {
        return ViagemMapper.toResponse(buscarEntidadePorId(id));
    }

    @Override
    public ViagemResponseDTO criar(ViagemRequestDTO dto) {
        validarDatas(dto);
        Veiculo veiculo = buscarVeiculo(dto.veiculoId());
        Viagem viagem = ViagemMapper.toEntity(dto, veiculo);
        return ViagemMapper.toResponse(viagemRepository.save(viagem));
    }

    @Override
    public ViagemResponseDTO atualizar(Long id, ViagemRequestDTO dto) {
        validarDatas(dto);
        Viagem viagem = buscarEntidadePorId(id);
        Veiculo veiculo = buscarVeiculo(dto.veiculoId());
        ViagemMapper.aplicarDados(viagem, dto, veiculo);
        return ViagemMapper.toResponse(viagemRepository.save(viagem));
    }

    @Override
    public void deletar(Long id) {
        Viagem viagem = buscarEntidadePorId(id);
        viagemRepository.delete(viagem);
    }

    private Viagem buscarEntidadePorId(Long id) {
        return viagemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Viagem não encontrada: id=" + id));
    }

    private Veiculo buscarVeiculo(Long veiculoId) {
        return veiculoRepository.findById(veiculoId)
            .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado: id=" + veiculoId));
    }

    private void validarDatas(ViagemRequestDTO dto) {
        if (dto.dataChegada() != null && dto.dataChegada().isBefore(dto.dataSaida())) {
            throw new BusinessRuleException("Data/hora de chegada não pode ser anterior à data/hora de saída");
        }
    }
}

package com.logitrackpro.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.logitrackpro.api.dto.dashboard.DashboardResponseDTO;
import com.logitrackpro.api.dto.dashboard.KmTotalDTO;
import com.logitrackpro.api.dto.dashboard.ProjecaoFinanceiraDTO;
import com.logitrackpro.api.dto.dashboard.ProximaManutencaoDTO;
import com.logitrackpro.api.dto.dashboard.RankingUtilizacaoDTO;
import com.logitrackpro.api.dto.dashboard.VolumeCategoriaDTO;
import com.logitrackpro.api.repository.ManutencaoRepository;
import com.logitrackpro.api.repository.VeiculoRepository;
import com.logitrackpro.api.repository.ViagemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ViagemRepository viagemRepository;
    private final VeiculoRepository veiculoRepository;
    private final ManutencaoRepository manutencaoRepository;

    @Override
    public DashboardResponseDTO montarDashboard(Long veiculoId) {
        KmTotalDTO kmTotal = new KmTotalDTO(viagemRepository.calcularTotalKm(veiculoId), veiculoId);

        var volumePorCategoria = veiculoRepository.volumePorCategoria().stream()
            .map(p -> new VolumeCategoriaDTO(p.getCategoria(), p.getQuantidadeViagens()))
            .toList();

        var proximasManutencoes = manutencaoRepository.proximasManutencoes().stream()
            .map(p -> new ProximaManutencaoDTO(
                p.getId(), p.getVeiculoId(), p.getPlaca(), p.getModelo(),
                p.getDataInicio(), p.getTipoServico(), p.getCustoEstimado(), p.getStatus()
            ))
            .toList();

        var rankingUtilizacao = veiculoRepository.rankingUtilizacao().stream()
            .map(p -> new RankingUtilizacaoDTO(p.getVeiculoId(), p.getPlaca(), p.getModelo(), p.getKmAcumulado()))
            .toList();

        var projecao = manutencaoRepository.projecaoFinanceiraMesAtual().getFirst();
        ProjecaoFinanceiraDTO projecaoFinanceira = new ProjecaoFinanceiraDTO(
            projecao.getCustoTotalEstimado(), projecao.getQuantidadeManutencoes()
        );

        return new DashboardResponseDTO(kmTotal, volumePorCategoria, proximasManutencoes, rankingUtilizacao, projecaoFinanceira);
    }
}

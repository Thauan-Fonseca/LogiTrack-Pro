package com.logitrackpro.api.service;

import com.logitrackpro.api.dto.dashboard.DashboardResponseDTO;

public interface DashboardService {

    DashboardResponseDTO montarDashboard(Long veiculoId);
}

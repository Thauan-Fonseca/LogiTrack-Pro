package com.logitrackpro.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.logitrackpro.api.dto.dashboard.DashboardResponseDTO;
import com.logitrackpro.api.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponseDTO obter(@RequestParam(required = false) Long veiculoId) {
        return dashboardService.montarDashboard(veiculoId);
    }
}

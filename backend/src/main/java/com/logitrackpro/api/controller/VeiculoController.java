package com.logitrackpro.api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.logitrackpro.api.dto.VeiculoResponseDTO;
import com.logitrackpro.api.service.VeiculoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/veiculos")
@RequiredArgsConstructor
public class VeiculoController {

    private final VeiculoService veiculoService;

    @GetMapping
    public List<VeiculoResponseDTO> listar() {
        return veiculoService.listarTodos();
    }
}

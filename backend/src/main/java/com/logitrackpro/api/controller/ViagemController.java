package com.logitrackpro.api.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.logitrackpro.api.dto.ViagemRequestDTO;
import com.logitrackpro.api.dto.ViagemResponseDTO;
import com.logitrackpro.api.service.ViagemService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/viagens")
@RequiredArgsConstructor
public class ViagemController {

    private final ViagemService viagemService;

    @GetMapping
    public List<ViagemResponseDTO> listar() {
        return viagemService.listarTodos();
    }

    @GetMapping("/{id}")
    public ViagemResponseDTO buscarPorId(@PathVariable Long id) {
        return viagemService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ViagemResponseDTO> criar(@Valid @RequestBody ViagemRequestDTO dto) {
        ViagemResponseDTO criada = viagemService.criar(dto);
        return ResponseEntity.created(URI.create("/api/viagens/" + criada.id())).body(criada);
    }

    @PutMapping("/{id}")
    public ViagemResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody ViagemRequestDTO dto) {
        return viagemService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        viagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

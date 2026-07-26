package com.logitrackpro.api.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.logitrackpro.api.dto.auth.LoginRequestDTO;
import com.logitrackpro.api.dto.auth.LoginResponseDTO;
import com.logitrackpro.api.security.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
        var authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.username(), dto.senha())
        );
        UserDetails usuario = (UserDetails) authentication.getPrincipal();
        String token = jwtService.gerarToken(usuario);
        return new LoginResponseDTO(token, usuario.getUsername());
    }
}

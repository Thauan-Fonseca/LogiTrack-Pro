package com.logitrackpro.api.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
    @NotBlank(message = "Informe o usuário") String username,
    @NotBlank(message = "Informe a senha") String senha
) {
}

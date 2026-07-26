package com.logitrackpro.api.dto.auth;

public record LoginResponseDTO(
    String token,
    String username
) {
}

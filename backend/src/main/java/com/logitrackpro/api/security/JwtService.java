package com.logitrackpro.api.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMs;

    public JwtService(
        @Value("${app.jwt.secret}") String secret,
        @Value("${app.jwt.expiration-ms}") long expiracaoMs
    ) {
        this.chave = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiracaoMs = expiracaoMs;
    }

    public String gerarToken(UserDetails usuario) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expiracaoMs);
        return Jwts.builder()
            .subject(usuario.getUsername())
            .issuedAt(agora)
            .expiration(expiracao)
            .signWith(chave)
            .compact();
    }

    public String extrairUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean tokenValido(String token, UserDetails usuario) {
        try {
            Claims claims = parseClaims(token);
            return claims.getSubject().equals(usuario.getUsername()) && claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(chave)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}

package com.example.demo.auth.security;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secret; // défini dans application.properties

    @Value("${jwt.expiration}")
    private long expiration; // durée en millisecondes

    /**
     * Générer un token JWT
     */
    public String generateToken(String username, List<String> roles) {
        return JWT.create()
                .withSubject(username)
                .withClaim("roles", roles)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(Algorithm.HMAC256(secret));                
    }

    /**
     * Vérifier si un token est valide
     */
    public boolean validateToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret)).build();
            verifier.verify(token); // si erreur -> exception
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extraire le username (email) du token
     */
    public String getUsernameFromToken(String token) {
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
        return decodedJWT.getSubject();
    }

    /**
     * Extraire les rôles du token
     */
    public List<String> getRolesFromToken(String token) {
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
        return decodedJWT.getClaim("roles").asList(String.class);
    }
}

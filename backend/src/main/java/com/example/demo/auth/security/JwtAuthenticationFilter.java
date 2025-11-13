package com.example.demo.auth.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService; // ton UserDetailsServiceImpl

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Lire l'en-tête Authorization
        final String authHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Vérifier qu'on a bien "Bearer <token>"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // enlever "Bearer "
            try {
                username = jwtUtil.getUsernameFromToken(jwt);
            } catch (Exception e) {
                logger.warn("JWT invalide : " + e.getMessage());
            }
        }

        // Si on a un username et que pas déjà authentifié
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Charger l'utilisateur en BDD
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Vérifier que le token est valide
            if (jwtUtil.validateToken(jwt)) {
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Mettre l'utilisateur dans le contexte de sécurité Spring
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // Continuer la chaine de filtres
        filterChain.doFilter(request, response);
    }

}

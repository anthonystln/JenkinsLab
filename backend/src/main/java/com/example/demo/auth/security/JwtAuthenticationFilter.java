package com.example.demo.auth.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private UserDetailsService userDetailsService; // → UserDetailsServiceImpl

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String jwt = null;
        String email = null;

        // Vérifie "Bearer <token>"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                email = jwtUtil.getUsernameFromToken(jwt);
            } catch (Exception e) {
                logger.warn("❌ Token JWT invalide : " + e.getMessage());
            }
        }

        // Si l'utilisateur n'est pas encore authentifié dans le contexte
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Charger CustomUserDetails via l’email
            var userDetails = userDetailsService.loadUserByUsername(email);

            // Vérifier signature + expiration
            if (jwtUtil.validateToken(jwt)) {

                // Extraire userId qui est maintenant dans le token
                Long userId = jwtUtil.getUserIdFromToken(jwt);

                // Convertir en CustomUserDetails
                CustomUserDetails customUser = (CustomUserDetails) userDetails;

                // Authentification Spring Security
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                customUser,
                                null,
                                customUser.getAuthorities()
                        );

                // Associer l'authentification au contexte
                SecurityContextHolder.getContext().setAuthentication(authToken);

                logger.info("🔐 Authentifié : " + email + " (userId = " + userId + ")");
            }
        }

        filterChain.doFilter(request, response);
    }
}

package com.example.demo.auth.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.security.JwtUtil;
import com.example.demo.user.domain.Role;
import com.example.demo.user.domain.Status;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Enregistrement d’un utilisateur
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User userRequest) {
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        // Hasher le mot de passe
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        // Valeurs par défaut si non fournies
        if (userRequest.getRole() == null) {
            userRequest.setRole(Role.USER);
        }
        if (userRequest.getStatus() == null) {
            userRequest.setStatus(Status.ACTIVE);
        }

        User savedUser = userRepository.save(userRequest);

        return ResponseEntity.ok(savedUser);
    }

    /**
     * Connexion utilisateur
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        // Vérifier credentials avec Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Générer le JWT
        String token = jwtUtil.generateToken(email,
            Collections.singletonList(
                authentication.getAuthorities().iterator().next().getAuthority()
            )
        );

        return ResponseEntity.ok(Map.of(
            "token", token,
            "email", email,
            "roles", authentication.getAuthorities()
        ));
    }
}
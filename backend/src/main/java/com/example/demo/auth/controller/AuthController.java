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
    public ResponseEntity<?> register(@RequestBody @jakarta.validation.Valid com.example.demo.user.dto.RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(Status.PENDING);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new com.example.demo.user.dto.UserDto(
            savedUser.getId(), 
            savedUser.getName(), 
            savedUser.getEmail(), 
            savedUser.getRole().name(), 
            savedUser.getStatus().name()
        ));
    }

    /**
     * Connexion utilisateur
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @jakarta.validation.Valid com.example.demo.user.dto.LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Vérifier credentials avec Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        // 🛑 Vérification du statut
        if (user.getStatus() == Status.BANNED) {
            return ResponseEntity.status(403).body("Votre compte a été suspendu. Contactez l'administrateur.");
        }
        if (user.getStatus() == Status.PENDING) {
            return ResponseEntity.status(403).body("Votre compte est en attente de validation.");
        }

        // Générer le JWT
        String token = jwtUtil.generateToken(email, user.getId(),
            Collections.singletonList(
                authentication.getAuthorities().iterator().next().getAuthority()
            )
        );

        return ResponseEntity.ok(Map.of(
            "token", token,
            "email", email,
            "userId", user.getId(),
            "roles", authentication.getAuthorities()
        ));
    }
}
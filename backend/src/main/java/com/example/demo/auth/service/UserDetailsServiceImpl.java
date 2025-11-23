package com.example.demo.auth.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.auth.security.CustomUserDetails;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;

    /**
     * Spring Security appelle cette méthode automatiquement
     * quand il a besoin de charger un utilisateur par son email.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec email : " + email));
        
        // 🚀 DEBUG LOGS
        System.out.println("🔎 Authentification - utilisateur trouvé en base : " + user.getEmail());
        System.out.println("🔑 Password hash en BDD : " + user.getPassword());
        System.out.println("🎭 Rôle : " + user.getRole());
        
        // Transformer notre User en UserDetails (objet utilisé par Spring Security)
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new CustomUserDetails(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(authority),
                user.getId() // ⭐ ON RÉCUPÈRE L’ID
        );
    }
}

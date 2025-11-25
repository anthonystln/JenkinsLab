package com.example.demo.user.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.user.domain.Role;
import com.example.demo.user.domain.Status;
import com.example.demo.user.domain.User;
import com.example.demo.user.dto.PageResponse;
import com.example.demo.user.dto.UpdateUserRequest;
import com.example.demo.user.dto.UserDto;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.repository.UserSpecifications;
import com.example.demo.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Injection de dépendance via le constructeur
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retourne tous les utilisateurs (réservé aux ADMIN)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<UserDto>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String role,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "id,asc") String sort
    ) {
        // Parsing du tri
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        String sortDirection = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ? "desc" : "asc";

        Pageable pageable = PageRequest.of(
            page,
            size,
            sortDirection.equals("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending()
        );

        // Construction des filtres dynamiques
        Specification<User> spec = Specification.where(UserSpecifications.hasRole(role))
            .and(UserSpecifications.hasStatus(status))
            .and(UserSpecifications.search(q));

        Page<User> userPage = userRepository.findAll(spec, pageable);

        List<UserDto> userDtos = userPage.getContent().stream()
                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getStatus().name()))
                .toList();
        
        return ResponseEntity.ok(new PageResponse<>(
            userDtos,
            userPage.getNumber(),
            userPage.getSize(),
            userPage.getTotalElements(),
            userPage.getTotalPages()
        ));
    }

    // --- recherche + pagination ---
    @GetMapping("/search")
    public PageResponse<User> searchUsers(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "ASC") String sortDirection
    ) {
        String safeField = normalizeSortField(sortField);
        String safeDir = normalizeSortDirection(sortDirection);
        return userService.searchUserPaged(q, page, size, safeField, safeDir);
    }

    @GetMapping("/filter")
    public PageResponse<User> filterUsers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "name") String sortField,
            @RequestParam(defaultValue = "ASC") String sortDirection
    ) {
        String safeField = normalizeSortField(sortField);
        String safeDir = normalizeSortDirection(sortDirection);
        return userService.filterUsers(q, status, role, page, size, safeField, safeDir);
    }

    // @GetMapping("/filter")
    // public PageResponse<User> filterUsers(
    //         @RequestParam(defaultValue = "") String q,
    //         @RequestParam(required = false) Status status,
    //         @RequestParam(required = false) Role role,
    //         @RequestParam(defaultValue = "0") int page,
    //         @RequestParam(defaultValue = "6") int size
    // ) {
    //     if (status != null && role != null) {
    //         return userService.getUsersByStatusAndRole(status, role, page, size);
    //     } else if (status != null) {
    //         return userService.getUsersByStatusPagedWithSearch(q, status, page, size);
    //     } else if (role != null) {
    //         return userService.getUsersByRolePagedWithSearch(q, role, page, size);
    //     } else {
    //         return userService.searchUserPaged(q, page, size);
    //     }
    // }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        // Valeur par défaut si non fournies
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        if (user.getStatus() == null) {
            user.setStatus(Status.ACTIVE);
        }

        // Mot de passe temporaire si non fourni
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode("TemPass123!"));
        }
        return userService.addUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody @Valid User user) {
        // On récupère l’utilisateur déjà en base
        User existingUser = userService.getUserById(id);

        // Si le mot de passe n’est pas envoyé → on garde l’ancien
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(existingUser.getPassword());
        } else {
            // sinon on encode le nouveau mot de passe
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Valeurs par défaut si manquantes
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        if (user.getStatus() == null) {
            user.setStatus(Status.ACTIVE);
        }

        return userService.updateUser(id, user);
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()") // l'utilisateur doit être connecté
    public ResponseEntity<UserDto> updateMyInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid UpdateUserRequest request
    ) {
        User updateUser = userService.updateMyInfo(userDetails.getUsername(), request);

        // Retourne un UserDTO pour ne pas exposer le mot de passe
        UserDto dto = new UserDto(
            updateUser.getId(),
            updateUser.getName(),
            updateUser.getEmail(),
            updateUser.getRole().name(),
            updateUser.getStatus().name()
        );

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updatePassword(Authentication authentication, @RequestBody Map<String, String> body) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String newPassword = body.get("password");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Mot de passe requis");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    private String normalizeSortField(String field) {
        if (field == null) return "name";
        switch (field) {
            case "name":
            case "email":
            case "role":
            case "status":
                return field;
            default:
                return "name";
        }
    }

    private String normalizeSortDirection(String dir) {
        if (dir == null) return "ASC";
        String upper = dir.toUpperCase();
        return ("DESC".equals(upper)) ? "DESC" : "ASC";
    }
}
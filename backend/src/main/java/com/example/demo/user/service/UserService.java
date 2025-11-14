package com.example.demo.user.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.kafka.UserEventProducer;
import com.example.demo.shared.exception.EmailAlreadyUsedException;
import com.example.demo.user.domain.Role;
import com.example.demo.user.domain.Status;
import com.example.demo.user.domain.User;
import com.example.demo.user.dto.PageResponse;
import com.example.demo.user.dto.UpdateUserRequest;
import com.example.demo.user.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository repo;
    private final UserEventProducer userEventProducer;

    // Injection du repository via constructeur
    public UserService(UserRepository repo, UserEventProducer userEventProducer) {
        this.repo = repo;
        this.userEventProducer = userEventProducer;
    }

    // --- RECHERCHE SIMPLE ---
    public List<User> searchUsers(String q) {
        String needle = (q == null ? "" : q).toLowerCase();

        // On récupère tous les users en DB puis on filtre
        return repo.findAll().stream()
                .filter(u -> u.getName().toLowerCase().contains(needle) ||
                        u.getEmail().toLowerCase().contains(needle))
                .toList();
    }

    // --- RECHERCHE + PAGINATION ---
    public PageResponse<User> searchUserPaged(String q, int page, int size, String sortField, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> result = repo.findAll(pageable);

        // Applique un filtre en mémoire si q est renseigné.
        List<User> filtered = result.getContent().stream()
                .filter(u -> u.getName().toLowerCase().contains(q.toLowerCase())
                    || u.getEmail().toLowerCase().contains(q.toLowerCase()))
                .toList();

        return new PageResponse<>(filtered, page, size, (int) result.getTotalElements(), result.getTotalPages());
    }

    public List<User> getAllUsers() {
        return repo.findAll(); // SELECT * FROM users
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElse(null); // SELECT * FROM users WHERE id=?
    }

    public User addUser(User user) {
        User saved = repo.save(user);
        userEventProducer.sendUserEvent("User created: " + saved.getEmail());
        return saved;
    }

    public User updateUser(Long id, User updatedUser) {
        return repo.findById(id).map(u -> {
            u.setName(updatedUser.getName());
            u.setEmail(updatedUser.getEmail());
            return repo.save(u); // UPDATE
        }).orElse(null);
    }

    public User updateMyInfo(String username, UpdateUserRequest request) {
        User user = repo.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            Optional<User> existingUser = repo.findByEmail(request.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                throw new EmailAlreadyUsedException("Cet email est déjà utilisé par un autre compte.");
            }
            user.setEmail(request.getEmail());
        }

        return repo.save(user);
    }

    public void deleteUser(Long id) {
        repo.deleteById(id); // DELETE
    }

    public PageResponse<User> getUsersByStatusPagedWithSearch(String q, Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = repo.findByStatus(status, pageable);

        // applique un filtre en mémoire sur le nom/email si q n’est pas vide
        List<User> filtered = result.getContent().stream()
                .filter(u -> u.getName().toLowerCase().contains(q.toLowerCase())
                        || u.getEmail().toLowerCase().contains(q.toLowerCase()))
                .toList();

        return new PageResponse<>(filtered, page, size, (int) result.getTotalElements(), result.getTotalPages());
    }

    public PageResponse<User> getUsersByRolePagedWithSearch(String q, Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = repo.findByRole(role, pageable);

        List<User> filtered = result.getContent().stream()
                .filter(u -> u.getName().toLowerCase().contains(q.toLowerCase())
                        || u.getEmail().toLowerCase().contains(q.toLowerCase()))
                .toList();

        return new PageResponse<>(filtered, page, size, (int) result.getTotalElements(), result.getTotalPages());
    }

    public PageResponse<User> getUsersByStatusPaged(Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = repo.findByStatus(status, pageable);
        return new PageResponse<>(result.getContent(), page, size, result.getTotalElements(), result.getTotalPages());
    }

    public PageResponse<User> getUsersByRolePaged(Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = repo.findByRole(role, pageable);
        return new PageResponse<>(result.getContent(), page, size, result.getTotalElements(), result.getTotalPages());
    }

    public PageResponse<User> getUsersByStatusAndRole(Status status, Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = repo.findByStatusAndRole(status, role, pageable);
        return new PageResponse<>(
                result.getContent(),
                page,
                size,
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    // --- FILTRE combiné + PAGINATION + TRI ---
    public PageResponse<User> filterUsers(String q, Status status, Role role, int page, int size, String sortField, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        // Pour l'instant -> récupère tout et filtre en mémoire
        List<User> filtered = repo.findAll(pageable).getContent().stream()
            .filter(u -> {
                boolean match = true;

                if (q != null && !q.trim().isEmpty()) {
                    String name = u.getName() == null ? "" : u.getName().toLowerCase();
                    String email = u.getEmail() == null ? "" : u.getEmail().toLowerCase();
                    match = name.contains(q.toLowerCase()) || email.contains(q.toLowerCase());
                }
                if (status != null) {
                    match = match && u.getStatus() == status;
                }
                if (role != null) {
                    match = match && u.getRole() == role;
                }
                return match;
            })
            .toList();

        int from = Math.max(0, page * size);
        int to = Math.min(filtered.size(), from + size);
        List<User> slice = from >= filtered.size() ? Collections.emptyList() : filtered.subList(from, to);
        int totalPages = (int) Math.ceil((double) filtered.size() / (double) size);

        return new PageResponse<>(slice, page, size, filtered.size(), totalPages);
    }
}
package com.example.demo.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PageResponse;
import com.example.demo.model.Role;
import com.example.demo.model.Status;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository repo;

    // Injection du repository via constructeur
    public UserService(UserRepository repo) {
        this.repo = repo;
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
    public PageResponse<User> searchUserPaged(String q, int page, int size) {
        List<User> filtered = searchUsers(q);

        int from = Math.max(0, page * size);
        int to = Math.min(filtered.size(), from + size);

        List<User> slice = from >= filtered.size()
                ? Collections.emptyList()
                : filtered.subList(from, to);
        
        int totalPages = (int) Math.ceil((double) filtered.size() / (double) size);
        
        return new PageResponse<>(slice, page, size, filtered.size(), totalPages);
    }

    public List<User> getAllUsers() {
        return repo.findAll(); // SELECT * FROM users
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElse(null); // SELECT * FROM users WHERE id=?
    }

    public User addUser(User user) {
        return repo.save(user); // INSERT
    }

    public User updateUser(Long id, User updatedUser) {
        return repo.findById(id).map(u -> {
            u.setName(updatedUser.getName());
            u.setEmail(updatedUser.getEmail());
            return repo.save(u); // UPDATE
        }).orElse(null);
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

    public PageResponse<User> filterUsers(String q, Status status, Role role, int page, int size) {
        String needle = (q == null ? "" : q.trim().toLowerCase());

        List<User> filtered = repo.findAll().stream()
            .filter(u -> {
                boolean match = true;

                if (!needle.isEmpty()) {
                    String name = u.getName() == null ? "" : u.getName().toLowerCase();
                    String email = u.getEmail() == null ? "" : u.getEmail().toLowerCase();
                    match = name.contains(needle) || email.contains(needle);
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
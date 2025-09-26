package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PageResponse;
import com.example.demo.model.Role;
import com.example.demo.model.Status;
import com.example.demo.model.User;
import com.example.demo.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    // Injection de dépendance via le constructeur
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --- Récupérer tous les users ---
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // --- recherche + pagination ---
    @GetMapping("/search")
    public PageResponse<User> searchUsers(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return userService.searchUserPaged(q, page, size);
    }

    @GetMapping("/filter")
    public PageResponse<User> filterUsers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return userService.filterUsers(q, status, role, page, size);
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

    @PostMapping
    public User addUser(@Valid @RequestBody User user) {
        return userService.addUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
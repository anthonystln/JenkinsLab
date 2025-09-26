package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-incrément
    private Long id;

    @NotBlank(message = "Le nom est requis")
    @Size(min = 2, max = 50, message = "Le nom doit faire entre 2 et 50 caractères")
    private String name;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    @Pattern(
    regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
    message = "Email doit contenir un domaine valide (ex: .com, .fr)"
    )
    private String email;

    @Enumerated(EnumType.STRING) // Stocké en texte lisible (ADMIN, USER, etc.)
    private Role role;

    @Enumerated(EnumType.STRING) // Stocké en texte lisible (ACTIVE, BANNED, etc.)
    private Status status;

    // Constructeur vide requis par JPA
    public User() {}

    // Constructeur
    public User(Long id, String name, String email, Role role, Status status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
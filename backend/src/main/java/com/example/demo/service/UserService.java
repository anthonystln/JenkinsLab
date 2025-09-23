package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.User;

@Service
public class UserService {
    private final List<User> users = new ArrayList<>();

    public UserService() {
        // On pré-remplit avec 2 utilisateurs
        users.add(new User(1L, "Alice", "alice@example.com"));
        users.add(new User(2L, "Bob", "bob@example.com"));
    }

    public List<User> getAllUsers() {
        return users;
    }

    public User getUserById(Long id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst().orElse(null);
    }

    public User addUser(User user) {
        user.setId((long) (users.size() + 1)); // Auto Incremente simple
        users.add(user);
        return user;
    }

    public User updateUser(Long id, User updatedUser) {
        for (User u : users) {
            if (u.getId().equals(id)) {
                u.setName(updatedUser.getName());
                u.setEmail(updatedUser.getEmail());
                return u;
            }
        }
        return null;
    }

    public void deleteUser(Long id) {
        users.removeIf(u -> u.getId().equals(id));
    }
}

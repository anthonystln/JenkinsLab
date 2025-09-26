package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Role;
import com.example.demo.model.Status;
import com.example.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByStatus(Status status, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);
    Page<User> findByStatusAndRole(Status status, Role role, Pageable pageable);
}
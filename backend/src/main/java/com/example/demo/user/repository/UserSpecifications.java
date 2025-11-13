package com.example.demo.user.repository;

import org.springframework.data.jpa.domain.Specification;

import com.example.demo.user.domain.User;

public class UserSpecifications {
    public static Specification<User> hasRole(String role) {
        return (root, query, cb) ->
                role == null ? null : cb.equal(root.get("role"), role);
    }

    public static Specification<User> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<User> search(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isEmpty()) return null;
            String likeQuery = "%" + q.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), likeQuery),
                cb.like(cb.lower(root.get("email")), likeQuery)
            );
        };
    }
}

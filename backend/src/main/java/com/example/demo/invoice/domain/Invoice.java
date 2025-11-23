package com.example.demo.invoice.domain;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Double amount;

    @Enumerated(EnumType.STRING)
    private InvoiceStatus status = InvoiceStatus.PAID;

    @CreationTimestamp
    private Instant createdAt;
}

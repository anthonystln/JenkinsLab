package com.example.demo.invoice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.invoice.domain.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
}

package com.example.demo.invoice;

import java.time.Instant;

public class InvoiceNotification {
    
    private Long invoiceId;
    private Long userId;
    private String status;
    private String message;
    private Instant createdAt;

    public InvoiceNotification() {

    }

    public InvoiceNotification(Long invoiceId, Long userId, String status, String message, Instant createdAt) {
        this.invoiceId = invoiceId;
        this.userId = userId;
        this.status = status;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(Long invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

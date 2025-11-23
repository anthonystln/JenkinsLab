package com.example.demo.invoice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.auth.security.CustomUserDetails;
import com.example.demo.invoice.domain.Invoice;
import com.example.demo.invoice.domain.InvoiceStatus;
import com.example.demo.invoice.repository.InvoiceRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.example.demo.invoice.InvoiceNotification;
import java.time.Instant;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final String TOPIC = "invoice-events";

    public Invoice createInvoice(Invoice invoice) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();

        // On force l'ID du user connecté
        invoice.setUserId(user.getUserId());

        // Status toujours PENDING au début
        invoice.setStatus(InvoiceStatus.PENDING);
        
        Invoice saved = invoiceRepository.save(invoice);

        // Envoi Kafka en JSON
        String event = String.format(
            "{\"invoiceId\": %d, \"userId\": %d, \"amount\": %.2f, \"status\": \"%s\"}",
            saved.getId(),
            saved.getUserId(),
            saved.getAmount(),
            saved.getStatus()
        );

        System.out.println("Invoice event sent: " + event);

        kafkaTemplate.send(TOPIC, event);

        // Direct WebSocket notification (Bypass Kafka)
        InvoiceNotification notification = new InvoiceNotification(
            saved.getId(),
            saved.getUserId(),
            saved.getStatus().toString(),
            "Paiement initié. En attente de validation bancaire...",
            Instant.now()
        );
        messagingTemplate.convertAndSend("/topic/invoices/" + saved.getUserId(), notification);
        
        // 🚀 Simulation asynchrone du paiement (Banque)
        simulatePaymentProcessing(saved.getId(), saved.getUserId());

        return saved;
    }

    private void simulatePaymentProcessing(Long invoiceId, Long userId) {
        CompletableFuture.runAsync(() -> {
            try {
                System.out.println("⏳ Waiting for bank validation...");
                TimeUnit.SECONDS.sleep(5); // Simule le délai bancaire

                // Récupération et mise à jour
                Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
                if (invoice != null) {
                    invoice.setStatus(InvoiceStatus.PAID);
                    invoiceRepository.save(invoice);
                    System.out.println("✅ Payment validated for invoice " + invoiceId);

                    // Notification de succès
                    InvoiceNotification successNotif = new InvoiceNotification(
                        invoiceId,
                        userId,
                        "PAID",
                        "Paiement validé ! Votre abonnement est actif.",
                        Instant.now()
                    );
                    messagingTemplate.convertAndSend("/topic/invoices/" + userId, successNotif);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public List<Invoice> getInvoicesForUser(Long userId) {
        return invoiceRepository.findByUserId(userId);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }
}

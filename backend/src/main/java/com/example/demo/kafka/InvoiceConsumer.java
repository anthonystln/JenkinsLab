package com.example.demo.kafka;

import java.time.Instant;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.example.demo.invoice.InvoiceNotification;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "invoice-events", groupId = "invoice-group")
    public void listenInvoices(String message) {
        log.info("Invoice event received = {}", message);

        try {
            // Parse JSON du message Kafka
            JsonNode json = objectMapper.readTree(message);

            Long invoiceId = json.has("invoiceId") && !json.get("invoiceId").isNull()
                    ? json.get("invoiceId").asLong()
                    : null;
            
            Long userId = json.has("userId") && !json.get("userId").isNull()
                    ? json.get("userId").asLong()
                    : null;

            String status = json.has("status") ? json.get("status").asText() : "UNKNOWN";

            // Création de la notification envoyée au front
            InvoiceNotification notification = new InvoiceNotification(
                invoiceId,
                userId,
                status,
                "Paiement initié. En attente de validation bancaire...",
                Instant.now()
            );

            // Envoi WebSocket au frontend
            messagingTemplate.convertAndSend("/topic/invoices/" + userId, notification);
            log.info("🔥 Notification envoyée à /topic/invoices/" + userId);

            log.info("WebSocket notification sent: {} : {}", userId, notification);

        } catch (Exception e) {
            log.error("❌ Error parsing invoice event: {}", e.getMessage());
        }
    }
}

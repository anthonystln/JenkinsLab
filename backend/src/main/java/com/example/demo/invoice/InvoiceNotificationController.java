package com.example.demo.invoice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
@RequiredArgsConstructor
public class InvoiceNotificationController {
    
    private final SimpMessagingTemplate messagingTemplate;

    // Si un client envoie sur /app/invoices (via STOMP),
    // on renvoie vers /topic/invoices
    @MessageMapping("/invoices")
    public void forwardInvoiceNotification(InvoiceNotification notification) {
        messagingTemplate.convertAndSend("/topic/invoices", notification);
    }
}

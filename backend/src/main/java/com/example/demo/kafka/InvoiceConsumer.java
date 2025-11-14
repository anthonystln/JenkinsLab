package com.example.demo.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class InvoiceConsumer {

    @KafkaListener(topics = "invoice-events", groupId = "invoice-group")
    public void listenInvoices(String message) {
        System.out.println("Invoice event received = " + message);
    }
}

package com.example.demo.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class InvoiceEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public InvoiceEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendInvoiceEvent(String message) {
        System.out.println("Invoice event sent: " + message);
        kafkaTemplate.send("invoice-events", message);
    }
}
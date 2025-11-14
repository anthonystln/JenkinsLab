package com.example.demo.invoice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.invoice.domain.Invoice;
import com.example.demo.invoice.repository.InvoiceRepository;

@Service
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "invoice-events";

    public Invoice createInvoice(Invoice invoice) {
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
        return saved;
    }
}

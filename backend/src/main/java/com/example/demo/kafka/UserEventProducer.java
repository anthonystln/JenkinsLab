package com.example.demo.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserEventProducer {
    
    private final KafkaTemplate<String, String> kafkaTemplate;

    public UserEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendUserEvent(String message) {
        kafkaTemplate.send(KafkaConfig.USER_TOPIC, message);
        System.out.println("Kafka event send " + message);
    }
}

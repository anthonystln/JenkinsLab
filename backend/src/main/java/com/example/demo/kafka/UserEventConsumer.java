package com.example.demo.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class UserEventConsumer {
    
    @KafkaListener(topics = KafkaConfig.USER_TOPIC, groupId = "saas-group")
    public void consume(String message) {
        System.out.println("Kafka event received: " + message);
    }
}

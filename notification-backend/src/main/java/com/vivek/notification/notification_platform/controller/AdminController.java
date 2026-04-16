package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.entity.DeadLetterJob;
import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.repository.ClientRepository;
import com.vivek.notification.notification_platform.repository.NotificationJobRepository;
import com.vivek.notification.notification_platform.service.ClientService;
import com.vivek.notification.notification_platform.service.DeadLetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClientRepository clientRepository;
    private final NotificationJobRepository jobRepository;
    private final DeadLetterService deadLetterService;
    private final ClientService clientService;

    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<NotificationJob>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/dlq")
    public ResponseEntity<List<DeadLetterJob>> getDlq() {
        return ResponseEntity.ok(deadLetterService.getAllActiveDlqJobs());
    }

    @PostMapping("/dlq/{id}/replay")
    public ResponseEntity<?> replayDlq(@PathVariable Long id) {
        deadLetterService.replayJob(id);
        return ResponseEntity.ok(Map.of("message", "Job replayed successfully"));
    }

    @DeleteMapping("/dlq/{id}")
    public ResponseEntity<?> discardDlq(@PathVariable Long id) {
        deadLetterService.discardJob(id);
        return ResponseEntity.ok(Map.of("message", "Job discarded"));
    }

    @PutMapping("/clients/{id}/block")
    public ResponseEntity<?> blockClient(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        client.setActive(false);
        clientRepository.save(client);
        return ResponseEntity.ok(Map.of("message", "Client blocked"));
    }
}
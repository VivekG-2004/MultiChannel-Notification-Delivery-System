package com.vivek.notification.notification_platform.service;

import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.exception.ClientNotFoundException;
import com.vivek.notification.notification_platform.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public Client registerClient(String name, String email) {
        if (clientRepository.existsByEmail(email)) {
            throw new RuntimeException("Client with this email already exists");
        }

        Client client = new Client();
        client.setName(name);
        client.setEmail(email);
        client.setApiKey(generateApiKey());
        client.setPlan(Client.Plan.FREE);
        client.setActive(true);
        client.setCreatedAt(LocalDateTime.now());

        return clientRepository.save(client);
    }

    public Client getClientByApiKey(String apiKey) {
        return clientRepository.findByApiKey(apiKey)
                .orElseThrow(() -> new RuntimeException("Invalid API key"));
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with this id"));
    }

    private String generateApiKey() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
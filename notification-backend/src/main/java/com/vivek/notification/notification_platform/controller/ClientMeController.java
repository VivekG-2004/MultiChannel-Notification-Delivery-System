package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.exception.ClientNotFoundException;
import com.vivek.notification.notification_platform.repository.ClientRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientMeController {

    private final ClientRepository clientRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(HttpServletRequest request) {
        String apiKey = request.getHeader("X-API-KEY");
        Client client = clientRepository.findByApiKey(apiKey)
                .orElseThrow(() -> new ClientNotFoundException("Client not found"));
        return ResponseEntity.ok(Map.of(
                "id", client.getId(),
                "name", client.getName(),
                "email", client.getEmail()
        ));
    }
}
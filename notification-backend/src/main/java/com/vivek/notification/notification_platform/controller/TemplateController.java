package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.dto.TemplateRequest;
import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.entity.Template;
import com.vivek.notification.notification_platform.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @PostMapping
    public ResponseEntity<Template> createTemplate(
            @RequestBody TemplateRequest request,
            Authentication authentication) {

        Client client = (Client) authentication.getPrincipal();

        Template template = templateService.createTemplate(
                client,
                request.getName(),
                request.getChannel(),
                request.getSubject(),
                request.getBody()
        );

        return ResponseEntity.ok(template);
    }

    @GetMapping
    public ResponseEntity<List<Template>> getTemplates(
            Authentication authentication) {

        Client client = (Client) authentication.getPrincipal();
        return ResponseEntity.ok(
                templateService.getTemplatesForClient(client.getId())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.ok(Map.of("message", "Template deleted"));
    }
}
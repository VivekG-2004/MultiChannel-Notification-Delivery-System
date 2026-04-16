package com.vivek.notification.notification_platform.service;

import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.entity.NotificationChannel;
import com.vivek.notification.notification_platform.entity.Template;
import com.vivek.notification.notification_platform.exception.TemplateNotFoundException;
import com.vivek.notification.notification_platform.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class TemplateService {

    private final TemplateRepository templateRepository;

    public Template createTemplate(Client client, String name,
                                   NotificationChannel channel,
                                   String subject, String body) {
        Template template = new Template();
        template.setClient(client);
        template.setName(name);
        template.setChannel(channel);
        template.setSubject(subject);
        template.setBody(body);
        template.setCreatedAt(LocalDateTime.now());

        return templateRepository.save(template);
    }

    public List<Template> getTemplatesForClient(Long clientId) {

        return templateRepository.findByClientId(clientId);
    }

    public Template getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new TemplateNotFoundException("Template not found with id: " + id));
    }

    public String renderTemplate(String body, Map<String, String> data) {
        if (data == null) return body;
        for (Map.Entry<String, String> entry : data.entrySet()) {
            body = body.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return body;
    }

    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
}
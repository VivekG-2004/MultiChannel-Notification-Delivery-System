package com.vivek.notification.notification_platform.channel;

import com.vivek.notification.notification_platform.entity.NotificationJob;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class WebhookChannelHandler implements ChannelHandler {

    @Override
    public void deliver(NotificationJob job) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(job.getBody(), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                job.getRecipient(),
                request,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Webhook delivery failed: " + response.getBody());
        }
    }

    @Override
    public String getChannel() {
        return "WEBHOOK";
    }
}
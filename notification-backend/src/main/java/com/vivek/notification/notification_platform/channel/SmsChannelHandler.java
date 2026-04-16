package com.vivek.notification.notification_platform.channel;

import com.vivek.notification.notification_platform.entity.NotificationJob;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SmsChannelHandler implements ChannelHandler {

    @Value("${app.sms.api.key}")
    private String smsApiKey;

    @Override
    public void deliver(NotificationJob job) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("authorization", smsApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("sender_id", "NOTIFY");
        body.put("message", job.getBody());
        body.put("language", "english");
        body.put("route", "qt");
        body.put("numbers", job.getRecipient());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://www.fast2sms.com/dev/bulkV2",
                request,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("SMS delivery failed: " + response.getBody());
        }
    }

    @Override
    public String getChannel() {
        return "SMS";
    }
}
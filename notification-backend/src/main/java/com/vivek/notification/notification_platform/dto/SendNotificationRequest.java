package com.vivek.notification.notification_platform.dto;

import com.vivek.notification.notification_platform.entity.NotificationChannel;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class SendNotificationRequest {
    private NotificationChannel channel;
    private String recipient;
    private String subject;
    private String body;
    private Long templateId;
    private Map<String, String> data;
    private LocalDateTime scheduledAt;
}
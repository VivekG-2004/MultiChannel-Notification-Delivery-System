package com.vivek.notification.notification_platform.dto;

import com.vivek.notification.notification_platform.entity.NotificationChannel;
import lombok.Data;

@Data
public class TemplateRequest {
    private String name;
    private NotificationChannel channel;
    private String subject;
    private String body;
}
package com.vivek.notification.notification_platform.dto;

import lombok.Data;

@Data
public class NotificationResponse {
    private Long jobId;
    private String status;
    private String message;

    public static NotificationResponse success(Long jobId) {
        NotificationResponse response = new NotificationResponse();
        response.setJobId(jobId);
        response.setStatus("ACCEPTED");
        response.setMessage("Notification accepted and queued for delivery");
        return response;
    }
}
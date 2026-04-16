package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.dto.SendNotificationRequest;
import com.vivek.notification.notification_platform.dto.NotificationResponse;
import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notify")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<?> sendNotification(
            @RequestBody SendNotificationRequest request,
            Authentication authentication) {

        Client client = (Client) authentication.getPrincipal();

        NotificationJob job = notificationService.createJob(
                client,
                request.getChannel(),
                request.getRecipient(),
                request.getSubject(),
                request.getBody(),
                request.getTemplateId(),
                request.getData(),
                request.getScheduledAt()
        );

        return ResponseEntity.ok(NotificationResponse.success(job.getId()));
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleNotification(
            @RequestBody SendNotificationRequest request,
            Authentication authentication) {

        Client client = (Client) authentication.getPrincipal();

        NotificationJob job = notificationService.createJob(
                client,
                request.getChannel(),
                request.getRecipient(),
                request.getSubject(),
                request.getBody(),
                request.getTemplateId(),
                request.getData(),
                request.getScheduledAt()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Notification scheduled successfully",
                "jobId", job.getId(),
                "scheduledAt", request.getScheduledAt()
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<List<NotificationJob>> getHistory(
            Authentication authentication) {

        Client client = (Client) authentication.getPrincipal();
        return ResponseEntity.ok(
                notificationService.getJobsForClient(client.getId())
        );
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<?> getStatus(@PathVariable Long id,
                                       Authentication authentication) {
        NotificationJob job = notificationService.getJobById(id);
        return ResponseEntity.ok(Map.of(
                "jobId", job.getId(),
                "status", job.getStatus(),
                "channel", job.getChannel(),
                "retryCount", job.getRetryCount(),
                "createdAt", job.getCreatedAt()
        ));
    }
}
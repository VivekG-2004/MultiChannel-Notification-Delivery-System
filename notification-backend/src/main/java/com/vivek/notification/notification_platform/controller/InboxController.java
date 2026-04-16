package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.entity.InAppNotification;
import com.vivek.notification.notification_platform.repository.InAppNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inbox")
@RequiredArgsConstructor
public class InboxController {

    private final InAppNotificationRepository inAppRepository;

    @GetMapping("/{userRef}")
    public ResponseEntity<List<InAppNotification>> getInbox(
            @PathVariable String userRef,
            @RequestParam Long clientId) {

        return ResponseEntity.ok(
                inAppRepository.findByClientIdAndUserRefAndIsReadFalse(
                        clientId, userRef)
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        inAppRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            inAppRepository.save(n);
        });
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }
}
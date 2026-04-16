package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.dto.AnalyticsSummaryDto;
import com.vivek.notification.notification_platform.entity.Client;
import com.vivek.notification.notification_platform.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDto> getSummary(
            Authentication authentication) {

        // If client is calling → their jobs only
        if (authentication.getPrincipal() instanceof Client client) {
            return ResponseEntity.ok(
                    analyticsService.getSummaryForClient(client.getId())
            );
        }

        // If admin is calling → all jobs globally
        return ResponseEntity.ok(analyticsService.getGlobalSummary());
    }

    @GetMapping("/channels")
    public ResponseEntity<?> getByChannel(
            Authentication authentication) {

        AnalyticsSummaryDto summary;

        // If client is calling → their jobs only
        if (authentication.getPrincipal() instanceof Client client) {
            summary = analyticsService.getSummaryForClient(client.getId());
        } else {
            // Admin → all jobs globally
            summary = analyticsService.getGlobalSummary();
        }

        return ResponseEntity.ok(Map.of(
                "byChannel", summary.getByChannel(),
                "totalSent", summary.getTotalSent()
        ));
    }

    @GetMapping("/dlq-size")
    public ResponseEntity<?> getDlqSize() {
        return ResponseEntity.ok(Map.of(
                "dlqSize", analyticsService.getDlqSize()
        ));
    }
}
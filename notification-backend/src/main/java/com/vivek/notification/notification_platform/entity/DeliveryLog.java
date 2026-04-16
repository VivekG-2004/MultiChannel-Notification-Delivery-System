package com.vivek.notification.notification_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_logs")
@Data
public class DeliveryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private NotificationJob job;

    @Column(name = "attempt_no", nullable = false)
    private int attemptNo;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    @Column(columnDefinition = "TEXT")
    private String response;

    @Column(name = "attempted_at", nullable = false)
    private LocalDateTime attemptedAt;

    public enum DeliveryStatus {
        SUCCESS, FAILURE
    }
}
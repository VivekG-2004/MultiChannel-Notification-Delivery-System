package com.vivek.notification.notification_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "dead_letter_jobs")
@Data
public class DeadLetterJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_job_id", nullable = false)
    private Long originalJobId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Enumerated(EnumType.STRING)
    private NotificationChannel channel;

    private String recipient;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "retry_count")
    private int retryCount;

    @Column(name = "failed_at", nullable = false)
    private LocalDateTime failedAt;

    @Column(name = "is_replayed")
    private boolean isReplayed = false;

    @Column(name = "replayed_at")
    private LocalDateTime replayedAt;

    @Column(name = "is_discarded")
    private boolean isDiscarded = false;
}
package com.vivek.notification.notification_platform.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "client_usage")
@Data
public class ClientUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "usage_month", nullable = false)
    private LocalDate usageMonth;

    @Column(name = "total_sent")
    private int totalSent = 0;
}
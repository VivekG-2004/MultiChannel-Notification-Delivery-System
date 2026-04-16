package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.ClientUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface ClientUsageRepository extends JpaRepository<ClientUsage, Long> {
    Optional<ClientUsage> findByClientIdAndUsageMonth(Long clientId, LocalDate usageMonth);
}
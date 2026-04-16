package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.DeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryLogRepository extends JpaRepository<DeliveryLog, Long> {
    List<DeliveryLog> findByJobId(Long jobId);
}
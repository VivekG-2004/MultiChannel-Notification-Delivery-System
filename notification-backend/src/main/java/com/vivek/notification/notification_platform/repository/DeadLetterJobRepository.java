package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.DeadLetterJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeadLetterJobRepository extends JpaRepository<DeadLetterJob, Long> {
    List<DeadLetterJob> findByClientId(Long clientId);
    List<DeadLetterJob> findByIsDiscardedFalse();
}
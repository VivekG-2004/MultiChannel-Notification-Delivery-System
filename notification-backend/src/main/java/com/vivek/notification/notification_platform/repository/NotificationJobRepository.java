package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.entity.NotificationJob.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface NotificationJobRepository extends JpaRepository<NotificationJob, Long> {

    List<NotificationJob> findByClientId(Long clientId);

    @Query("SELECT j FROM NotificationJob j WHERE j.status IN ('PENDING', 'RETRYING') " +
            "AND (j.nextRetryAt IS NULL OR j.nextRetryAt <= :now) " +
            "AND (j.scheduledAt IS NULL OR j.scheduledAt <= :now)")
    List<NotificationJob> findJobsReadyToProcess(LocalDateTime now);
}
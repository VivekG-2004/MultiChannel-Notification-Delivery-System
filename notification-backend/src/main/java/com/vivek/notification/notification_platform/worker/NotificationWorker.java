package com.vivek.notification.notification_platform.worker;

import com.vivek.notification.notification_platform.channel.ChannelDispatcher;
import com.vivek.notification.notification_platform.entity.DeliveryLog;
import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.repository.DeliveryLogRepository;
import com.vivek.notification.notification_platform.repository.NotificationJobRepository;
import com.vivek.notification.notification_platform.service.RetryEngineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationWorker {

    private final NotificationJobRepository jobRepository;
    private final DeliveryLogRepository deliveryLogRepository;
    private final ChannelDispatcher channelDispatcher;
    private final RetryEngineService retryEngineService;

    @Scheduled(fixedDelay = 30000) // runs every 30 seconds
    @Transactional
    public void processJobs() {
        log.info("Worker started - checking for pending jobs");

        List<NotificationJob> jobs = jobRepository
                .findJobsReadyToProcess(LocalDateTime.now());

        if (jobs.isEmpty()) {
            log.info("No jobs to process");
            return;
        }

        log.info("Found {} jobs to process", jobs.size());

        for (NotificationJob job : jobs) {
            try {
                processJob(job);
            } catch (org.springframework.orm.ObjectOptimisticLockingFailureException e) {
                log.info("Job {} already picked up by another thread - skipping", job.getId());
            }
        }
    }

    private void processJob(NotificationJob job) {
        // Mark as RUNNING
        job.setStatus(NotificationJob.JobStatus.RUNNING);
        jobRepository.save(job);

        try {
            // Try to deliver
            channelDispatcher.dispatch(job);

            // Success - log it
            logAttempt(job, DeliveryLog.DeliveryStatus.SUCCESS, "Delivered successfully");

            // Mark as COMPLETED
            retryEngineService.handleSuccess(job);

            log.info("Job {} delivered successfully via {}",
                    job.getId(), job.getChannel());

        } catch (Exception e) {
            // Failed - log it
            logAttempt(job, DeliveryLog.DeliveryStatus.FAILURE, e.getMessage());

            // Schedule retry or move to DLQ
            retryEngineService.handleFailure(job, e.getMessage());

            log.error("Job {} failed via {} - reason: {}",
                    job.getId(), job.getChannel(), e.getMessage());
        }
    }

    private void logAttempt(NotificationJob job,
                            DeliveryLog.DeliveryStatus status,
                            String response) {
        DeliveryLog log = new DeliveryLog();
        log.setJob(job);
        log.setAttemptNo(job.getRetryCount() + 1);
        log.setStatus(status);
        log.setResponse(response);
        log.setAttemptedAt(LocalDateTime.now());
        deliveryLogRepository.save(log);
    }
}
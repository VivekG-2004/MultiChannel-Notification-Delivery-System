package com.vivek.notification.notification_platform.service;

import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.repository.NotificationJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RetryEngineService {

    private final NotificationJobRepository jobRepository;
    private final DeadLetterService deadLetterService;

    private static final int BASE_MINUTES = 1;

    public void handleFailure(NotificationJob job, String errorMessage) {
        job.setErrorMessage(errorMessage);
        job.setRetryCount(job.getRetryCount() + 1);

        if (job.getRetryCount() >= job.getMaxRetries()) {
            // Move to dead letter queue
            job.setStatus(NotificationJob.JobStatus.FAILED);
            job.setProcessedAt(LocalDateTime.now());
            jobRepository.save(job);
            deadLetterService.moveToDeadLetter(job, errorMessage);
        } else {
            // Schedule next retry with exponential backoff
            long waitMinutes = (long) Math.pow(4, job.getRetryCount());
            job.setNextRetryAt(LocalDateTime.now().plusMinutes(waitMinutes));
            job.setStatus(NotificationJob.JobStatus.RETRYING);
            jobRepository.save(job);
        }
    }

    public void handleSuccess(NotificationJob job) {
        job.setStatus(NotificationJob.JobStatus.COMPLETED);
        job.setProcessedAt(LocalDateTime.now());
        jobRepository.save(job);
    }
}
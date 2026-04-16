package com.vivek.notification.notification_platform.service;

import com.vivek.notification.notification_platform.entity.DeadLetterJob;
import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.repository.DeadLetterJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeadLetterService {

    private final DeadLetterJobRepository deadLetterJobRepository;
    private final NotificationService notificationService;

    public void moveToDeadLetter(NotificationJob job, String reason) {
        DeadLetterJob dlq = new DeadLetterJob();
        dlq.setOriginalJobId(job.getId());
        dlq.setClient(job.getClient());
        dlq.setChannel(job.getChannel());
        dlq.setRecipient(job.getRecipient());
        dlq.setBody(job.getBody());
        dlq.setFailureReason(reason);
        dlq.setRetryCount(job.getRetryCount());
        dlq.setFailedAt(LocalDateTime.now());
        dlq.setReplayed(false);
        dlq.setDiscarded(false);

        deadLetterJobRepository.save(dlq);
    }

    public List<DeadLetterJob> getAllActiveDlqJobs() {
        return deadLetterJobRepository.findByIsDiscardedFalse();
    }

    public void replayJob(Long dlqId) {
        DeadLetterJob dlq = deadLetterJobRepository.findById(dlqId)
                .orElseThrow(() -> new RuntimeException("DLQ job not found"));

        notificationService.createJob(
                dlq.getClient(),
                dlq.getChannel(),
                dlq.getRecipient(),
                null,
                dlq.getBody(),
                null,
                null,
                null
        );

        dlq.setReplayed(true);
        dlq.setReplayedAt(LocalDateTime.now());
        deadLetterJobRepository.save(dlq);
    }

    public void discardJob(Long dlqId) {
        DeadLetterJob dlq = deadLetterJobRepository.findById(dlqId)
                .orElseThrow(() -> new RuntimeException("DLQ job not found"));
        dlq.setDiscarded(true);
        deadLetterJobRepository.save(dlq);
    }
}
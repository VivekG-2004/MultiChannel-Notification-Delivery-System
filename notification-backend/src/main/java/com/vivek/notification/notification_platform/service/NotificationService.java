package com.vivek.notification.notification_platform.service;

import com.vivek.notification.notification_platform.entity.*;
import com.vivek.notification.notification_platform.exception.PlanLimitExceededException;
import com.vivek.notification.notification_platform.repository.ClientUsageRepository;
import com.vivek.notification.notification_platform.repository.NotificationJobRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationJobRepository jobRepository;
    private final ClientUsageRepository usageRepository;
    private final TemplateService templateService;

    @Value("${app.free.plan.limit}")
    private int freePlanLimit;

    public NotificationJob createJob(Client client, NotificationChannel channel,
                                     String recipient, String subject,
                                     String body, Long templateId,
                                     Map<String, String> data,
                                     LocalDateTime scheduledAt) {
        // Check plan limit
        checkPlanLimit(client);

        // If template provided, render it
        if (templateId != null) {
            Template template = templateService.getTemplateById(templateId);
            body = templateService.renderTemplate(template.getBody(), data);
            if (subject == null) subject = template.getSubject();
        }

        NotificationJob job = new NotificationJob();
        job.setClient(client);
        job.setChannel(channel);
        job.setRecipient(recipient);
        job.setSubject(subject);
        job.setBody(body);
        job.setStatus(NotificationJob.JobStatus.PENDING);
        job.setCreatedAt(LocalDateTime.now());
        job.setScheduledAt(scheduledAt);

        if (templateId != null) {
            Template t = new Template();
            t.setId(templateId);
            job.setTemplate(t);
        }

        jobRepository.save(job);

        // Increment usage
        incrementUsage(client);

        return job;
    }

    public List<NotificationJob> getJobsForClient(Long clientId) {
        return jobRepository.findByClientId(clientId);
    }

    public NotificationJob getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    private void checkPlanLimit(Client client) {
        if (client.getPlan() == Client.Plan.PAID) return;

        LocalDate thisMonth = LocalDate.now().withDayOfMonth(1);
        Optional<ClientUsage> usage = usageRepository
                .findByClientIdAndUsageMonth(client.getId(), thisMonth);

        if (usage.isPresent() && usage.get().getTotalSent() >= freePlanLimit) {
            throw new PlanLimitExceededException("Free plan limit of 1000 notifications reached for this month");
        }
    }

    private void incrementUsage(Client client) {
        LocalDate thisMonth = LocalDate.now().withDayOfMonth(1);
        ClientUsage usage = usageRepository
                .findByClientIdAndUsageMonth(client.getId(), thisMonth)
                .orElseGet(() -> {
                    ClientUsage newUsage = new ClientUsage();
                    newUsage.setClient(client);
                    newUsage.setUsageMonth(thisMonth);
                    newUsage.setTotalSent(0);
                    return newUsage;
                });

        usage.setTotalSent(usage.getTotalSent() + 1);
        usageRepository.save(usage);
    }
}
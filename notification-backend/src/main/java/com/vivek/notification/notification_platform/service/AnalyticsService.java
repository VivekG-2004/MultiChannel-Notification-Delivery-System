package com.vivek.notification.notification_platform.service;

import com.vivek.notification.notification_platform.dto.AnalyticsSummaryDto;
import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.repository.NotificationJobRepository;
import com.vivek.notification.notification_platform.repository.DeadLetterJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final NotificationJobRepository jobRepository;
    private final DeadLetterJobRepository deadLetterJobRepository;

    public AnalyticsSummaryDto getSummaryForClient(Long clientId) {
        List<NotificationJob> jobs = jobRepository.findByClientId(clientId);

        long totalSent = jobs.size();

        long totalDelivered = jobs.stream()
                .filter(j -> j.getStatus() == NotificationJob.JobStatus.COMPLETED)
                .count();

        long totalFailed = jobs.stream()
                .filter(j -> j.getStatus() == NotificationJob.JobStatus.FAILED)
                .count();

        long totalRetrying = jobs.stream()
                .filter(j -> j.getStatus() == NotificationJob.JobStatus.RETRYING)
                .count();

        double deliveryRate = totalSent == 0 ? 0 :
                ((double) totalDelivered / totalSent) * 100;

        Map<String, Long> byChannel = jobs.stream()
                .collect(Collectors.groupingBy(
                        j -> j.getChannel().name(),
                        Collectors.counting()
                ));

        AnalyticsSummaryDto dto = new AnalyticsSummaryDto();
        dto.setTotalSent(totalSent);
        dto.setTotalDelivered(totalDelivered);
        dto.setTotalFailed(totalFailed);
        dto.setTotalRetrying(totalRetrying);
        dto.setDeliveryRate(Math.round(deliveryRate * 100.0) / 100.0);
        dto.setByChannel(byChannel);

        return dto;
    }

    public long getDlqSize() {
        return deadLetterJobRepository.findByIsDiscardedFalse().size();
    }

    public AnalyticsSummaryDto getGlobalSummary() {
        List<NotificationJob> jobs = jobRepository.findAll();

        long totalSent = jobs.size();

        long totalDelivered = jobs.stream()
                .filter(j -> j.getStatus() == NotificationJob.JobStatus.COMPLETED)
                .count();

        long totalFailed = jobs.stream()
                .filter(j -> j.getStatus() == NotificationJob.JobStatus.FAILED)
                .count();

        long totalRetrying = jobs.stream()
                .filter(j -> j.getStatus() == NotificationJob.JobStatus.RETRYING)
                .count();

        double deliveryRate = totalSent == 0 ? 0 :
                ((double) totalDelivered / totalSent) * 100;

        Map<String, Long> byChannel = jobs.stream()
                .collect(Collectors.groupingBy(
                        j -> j.getChannel().name(),
                        Collectors.counting()
                ));

        AnalyticsSummaryDto dto = new AnalyticsSummaryDto();
        dto.setTotalSent(totalSent);
        dto.setTotalDelivered(totalDelivered);
        dto.setTotalFailed(totalFailed);
        dto.setTotalRetrying(totalRetrying);
        dto.setDeliveryRate(Math.round(deliveryRate * 100.0) / 100.0);
        dto.setByChannel(byChannel);

        return dto;
    }
}
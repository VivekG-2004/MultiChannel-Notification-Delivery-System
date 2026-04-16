package com.vivek.notification.notification_platform.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AnalyticsSummaryDto {
    private long totalSent;
    private long totalDelivered;
    private long totalFailed;
    private long totalRetrying;
    private double deliveryRate;
    private Map<String, Long> byChannel;
}
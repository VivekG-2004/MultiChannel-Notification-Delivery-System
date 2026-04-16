package com.vivek.notification.notification_platform.channel;

import com.vivek.notification.notification_platform.entity.InAppNotification;
import com.vivek.notification.notification_platform.entity.NotificationJob;
import com.vivek.notification.notification_platform.repository.InAppNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class InAppChannelHandler implements ChannelHandler {

    private final InAppNotificationRepository inAppNotificationRepository;

    @Override
    public void deliver(NotificationJob job) throws Exception {
        InAppNotification notification = new InAppNotification();
        notification.setClient(job.getClient());
        notification.setUserRef(job.getRecipient());
        notification.setTitle(job.getSubject());
        notification.setBody(job.getBody());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        inAppNotificationRepository.save(notification);
    }

    @Override
    public String getChannel() {
        return "IN_APP";
    }
}
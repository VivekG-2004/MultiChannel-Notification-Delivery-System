package com.vivek.notification.notification_platform.channel;

import com.vivek.notification.notification_platform.entity.NotificationJob;

public interface ChannelHandler {
    void deliver(NotificationJob job) throws Exception;
    String getChannel();
}
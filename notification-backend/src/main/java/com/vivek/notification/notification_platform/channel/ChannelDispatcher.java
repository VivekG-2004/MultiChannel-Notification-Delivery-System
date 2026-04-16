package com.vivek.notification.notification_platform.channel;

import com.vivek.notification.notification_platform.entity.NotificationJob;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ChannelDispatcher {

    private final List<ChannelHandler> handlers;

    public void dispatch(NotificationJob job) throws Exception {
        String channel = job.getChannel().name();

        ChannelHandler handler = handlers.stream()
                .filter(h -> h.getChannel().equals(channel))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No handler found for channel: " + channel));

        handler.deliver(job);
    }
}
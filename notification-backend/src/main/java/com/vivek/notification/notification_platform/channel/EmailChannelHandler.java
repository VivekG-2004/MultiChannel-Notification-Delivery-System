package com.vivek.notification.notification_platform.channel;

import com.vivek.notification.notification_platform.entity.NotificationJob;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import jakarta.mail.internet.MimeMessage;

@Component
@RequiredArgsConstructor
public class EmailChannelHandler implements ChannelHandler {

    private final JavaMailSender mailSender;

    @Override
    public void deliver(NotificationJob job) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(job.getRecipient());
        helper.setSubject(job.getSubject() != null ? job.getSubject() : "Notification");
        helper.setText(job.getBody(), true);

        mailSender.send(message);
    }

    @Override
    public String getChannel() {
        return "EMAIL";
    }
}
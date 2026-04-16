package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.InAppNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InAppNotificationRepository extends JpaRepository<InAppNotification, Long> {
    List<InAppNotification> findByClientIdAndUserRefAndIsReadFalse(Long clientId, String userRef);
    List<InAppNotification> findByClientIdAndUserRef(Long clientId, String userRef);
}
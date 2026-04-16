package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TemplateRepository extends JpaRepository<Template, Long> {
    List<Template> findByClientId(Long clientId);
}
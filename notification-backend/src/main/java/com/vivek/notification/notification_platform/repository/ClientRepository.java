package com.vivek.notification.notification_platform.repository;

import com.vivek.notification.notification_platform.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByApiKey(String apiKey);
    Optional<Client> findByEmail(String email);
    boolean existsByEmail(String email);
}
package com.vivek.notification.notification_platform.controller;

import com.vivek.notification.notification_platform.dto.LoginRequest;
import com.vivek.notification.notification_platform.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername().equals(adminUsername) &&
                request.getPassword().equals(adminPassword)) {

            String token = jwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "message", "Login successful"
            ));
        }
        return ResponseEntity.status(401).body(Map.of(
                "message", "Invalid credentials"
        ));
    }
}
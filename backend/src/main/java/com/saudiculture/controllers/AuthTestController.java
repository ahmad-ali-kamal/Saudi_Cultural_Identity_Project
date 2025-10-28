package com.saudiculture.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import static net.logstash.logback.argument.StructuredArguments.keyValue;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication testing endpoints")
@Slf4j
public class AuthTestController {

    @GetMapping("/test")
    @Operation(
            summary = "Test authentication",
            description = "Protected endpoint to verify JWT authentication is working. Returns user info from JWT token.",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public Map<String, Object> testAuth(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        log.info("Auth test endpoint accessed",
                keyValue("username", authentication.getName()),
                keyValue("cognitoId", jwt.getSubject()));

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Authentication successful!");
        response.put("username", authentication.getName());
        response.put("cognitoId", jwt.getSubject());
        response.put("email", jwt.getClaim("email"));
        response.put("authorities", authentication.getAuthorities().toString());
        response.put("tokenIssuedAt", jwt.getIssuedAt());
        response.put("tokenExpiresAt", jwt.getExpiresAt());

        return response;
    }
}

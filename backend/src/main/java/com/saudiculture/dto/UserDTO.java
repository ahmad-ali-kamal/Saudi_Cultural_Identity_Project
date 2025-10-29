package com.saudiculture.dto;

import java.time.LocalDateTime;

public record UserDTO(
    String id,
    String cognitoId,
    String email,
    String username,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {

}
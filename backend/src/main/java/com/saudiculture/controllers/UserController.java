package com.saudiculture.controllers;

import com.saudiculture.dto.UserDTO;
import com.saudiculture.dto.UserStatsResponse;
import com.saudiculture.models.User;
import com.saudiculture.repositories.UserRepository;
import com.saudiculture.services.UserService;
import com.saudiculture.services.UserStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "User management and statistics endpoints")
public class UserController {

  private final UserService userService;
  private final UserStatsService userStatsService;
  private final UserRepository userRepository;

  @GetMapping("/me")
  @Operation(
      summary = "Get current user profile",
      description = "Retrieves or creates the user profile from JWT token, syncing with MongoDB"
  )
  public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    return ResponseEntity.ok(userService.syncUserFromJwt(jwt));
  }

  @GetMapping("/me/stats")
  @Operation(
      summary = "Get user quiz statistics",
      description = "Returns comprehensive statistics about the authenticated user's quiz performance, including overall stats, breakdowns by question type, region, and language, recent submissions, and identified strengths/weaknesses",
      security = @SecurityRequirement(name = "Bearer Authentication")
  )
  public ResponseEntity<UserStatsResponse> getUserStats(Authentication authentication) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    String cognitoId = jwt.getClaim("sub");

    User user = userRepository.findByCognitoId(cognitoId)
        .orElseThrow(() -> new IllegalStateException(
            "User not found. Please call /api/users/me to sync your profile first."));

    UserStatsResponse stats = userStatsService.getUserStats(user.getId());
    return ResponseEntity.ok(stats);
  }

}

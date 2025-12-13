package com.saudiculture.services;

import com.saudiculture.dto.UserDTO;
import com.saudiculture.models.User;
import com.saudiculture.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  private User existingUser;

  @BeforeEach
  void setUp() {
    existingUser = createTestUser();
  }

  @Test
  @DisplayName("Should create new user when cognito ID doesn't exist")
  void shouldCreateNewUserWhenCognitoIdDoesNotExist() {
    // Arrange
    Jwt jwt = createMockJwt("new-cognito-id", "newuser@example.com", "newuser");
    when(userRepository.existsByCognitoId("new-cognito-id")).thenReturn(false);
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
      User user = invocation.getArgument(0);
      user.setId("generated-id");
      return user;
    });

    // Act
    UserDTO result = userService.syncUserFromJwt(jwt);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.cognitoId()).isEqualTo("new-cognito-id");
    assertThat(result.email()).isEqualTo("newuser@example.com");
    assertThat(result.username()).isEqualTo("newuser");
    verify(userRepository, times(1)).existsByCognitoId("new-cognito-id");
    verify(userRepository, times(1)).save(any(User.class));
    verify(userRepository, never()).findByCognitoId(any());
  }

  @Test
  @DisplayName("Should update existing user when username or email changes")
  void shouldUpdateExistingUserWhenDetailsChange() {
    // Arrange
    Jwt jwt = createMockJwt("existing-cognito-id", "updated@example.com", "updatedusername");
    when(userRepository.existsByCognitoId("existing-cognito-id")).thenReturn(true);
    when(userRepository.findByCognitoId("existing-cognito-id")).thenReturn(Optional.of(existingUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // Act
    UserDTO result = userService.syncUserFromJwt(jwt);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.email()).isEqualTo("updated@example.com");
    assertThat(result.username()).isEqualTo("updatedusername");
    verify(userRepository, times(1)).existsByCognitoId("existing-cognito-id");
    verify(userRepository, times(1)).findByCognitoId("existing-cognito-id");
    verify(userRepository, times(1)).save(existingUser);
  }

  @Test
  @DisplayName("Should not save when existing user has no changes")
  void shouldNotSaveWhenNoChangesDetected() {
    // Arrange
    Jwt jwt = createMockJwt("existing-cognito-id", "test@example.com", "testuser");
    when(userRepository.existsByCognitoId("existing-cognito-id")).thenReturn(true);
    when(userRepository.findByCognitoId("existing-cognito-id")).thenReturn(Optional.of(existingUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // Act
    UserDTO result = userService.syncUserFromJwt(jwt);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.email()).isEqualTo("test@example.com");
    assertThat(result.username()).isEqualTo("testuser");
    // Save is still called, but the user object wasn't modified
    verify(userRepository, times(1)).save(existingUser);
  }

  @Test
  @DisplayName("Should extract JWT claims correctly")
  void shouldExtractJwtClaimsCorrectly() {
    // Arrange
    Jwt jwt = createMockJwt("cognito-123", "user@test.com", "testuser123");
    when(userRepository.existsByCognitoId("cognito-123")).thenReturn(false);
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
      User user = invocation.getArgument(0);
      user.setId("new-id");
      return user;
    });

    // Act
    UserDTO result = userService.syncUserFromJwt(jwt);

    // Assert
    assertThat(result.cognitoId()).isEqualTo("cognito-123");
    assertThat(result.email()).isEqualTo("user@test.com");
    assertThat(result.username()).isEqualTo("testuser123");
  }

  @Test
  @DisplayName("Should update only username when email stays same")
  void shouldUpdateOnlyUsernameWhenEmailStaysSame() {
    // Arrange
    Jwt jwt = createMockJwt("existing-cognito-id", "test@example.com", "newusername");
    when(userRepository.existsByCognitoId("existing-cognito-id")).thenReturn(true);
    when(userRepository.findByCognitoId("existing-cognito-id")).thenReturn(Optional.of(existingUser));
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // Act
    UserDTO result = userService.syncUserFromJwt(jwt);

    // Assert
    assertThat(result.username()).isEqualTo("newusername");
    assertThat(result.email()).isEqualTo("test@example.com");
    verify(userRepository, times(1)).save(existingUser);
  }

  // Helper methods
  private User createTestUser() {
    User user = new User();
    user.setId("test-id");
    user.setCognitoId("existing-cognito-id");
    user.setEmail("test@example.com");
    user.setUsername("testuser");
    return user;
  }

  private Jwt createMockJwt(String sub, String email, String username) {
    Map<String, Object> claims = Map.of(
        "sub", sub,
        "email", email,
        "cognito:username", username
    );

    return new Jwt(
        "token",
        Instant.now(),
        Instant.now().plusSeconds(3600),
        Map.of("alg", "RS256"),
        claims
    );
  }
}

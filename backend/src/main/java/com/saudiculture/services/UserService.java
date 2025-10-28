package com.saudiculture.services;

import static net.logstash.logback.argument.StructuredArguments.keyValue;

import com.saudiculture.dto.UserDTO;
import com.saudiculture.models.User;
import com.saudiculture.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;


  public UserDTO syncUserFromJwt(Jwt jwt) {

    String cognitoId = jwt.getClaim("sub");
    String email = jwt.getClaim("email");
    String username = jwt.getClaim("cognito:username");

    if (userRepository.existsByCognitoId(cognitoId)) {
      log.info("User already exists, updating username, and email if needed",
          keyValue("username", username), keyValue("email", email));

      User user = userRepository.findByCognitoId(cognitoId).get();
      if (!user.getUsername().equals(username)) {
        user.setUsername(username);
      }
      if (!user.getEmail().equals(email)) {
        user.setEmail(email);
      }
      user = userRepository.save(user);

      return convertToUserDTO(user);
    } else {
      log.info("Creating new user", keyValue("username", username), keyValue("email", email));
      User user = new User();
      user.setCognitoId(cognitoId);
      user.setUsername(username);
      user.setEmail(email);
      user = userRepository.save(user);

      return convertToUserDTO(user);
    }
  }

  private UserDTO convertToUserDTO(User user) {
    return new UserDTO(user.getId(), user.getCognitoId(), user.getEmail(), user.getUsername(),
        user.getCreatedAt(), user.getUpdatedAt());
  }
}

package com.saudiculture.repositories;

import com.saudiculture.models.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

  Optional<User> findByCognitoId(String cognitoId);

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);
}

package com.saudiculture.repositories;

import com.saudiculture.models.QuizSubmission;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizSubmissionRepository extends MongoRepository<QuizSubmission, String> {

  List<QuizSubmission> findByUserIdOrderBySubmittedAtDesc(String userId);
  long countByUserId(String userId);
}

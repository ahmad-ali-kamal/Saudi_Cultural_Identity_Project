package com.saudiculture.models;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "quiz_submissions")
public class QuizSubmission {

  @Id
  private String id;

  @Indexed
  private String userId;

  private List<QuizAnswer> answers;
  private Integer score;
  private Integer totalQuestions;

  @CreatedDate
  LocalDateTime submittedAt;
}

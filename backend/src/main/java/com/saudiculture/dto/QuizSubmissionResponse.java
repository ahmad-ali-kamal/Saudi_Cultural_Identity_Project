package com.saudiculture.dto;

import com.saudiculture.models.QuizAnswer;
import java.time.LocalDateTime;
import java.util.List;

public record QuizSubmissionResponse(
    String id,
    String userId,
    List<QuizAnswer> answers,
    Integer score,
    Integer totalQuestions,
    Double percentage,
    LocalDateTime submittedAt
) {

}

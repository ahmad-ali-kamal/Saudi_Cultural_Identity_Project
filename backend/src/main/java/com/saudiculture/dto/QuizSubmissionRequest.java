package com.saudiculture.dto;

import java.util.List;

public record QuizSubmissionRequest(
    List<AnswerInput> answers
) {

  public record AnswerInput(String questionId, String userAnswer) {}
}

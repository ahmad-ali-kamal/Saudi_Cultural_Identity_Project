package com.saudiculture.models;

public record QuizAnswer(
    String questionId,
    String questionText,
    String userAnswer,
    String correctAnswer,
    Boolean correct
) {

}

package com.saudiculture.dto;

import lombok.Data;

@Data
public class QuizQuestionDTO {
    private String questionText;
    private String[] options;
    private String answer;
    private String language;
    private String region;
    private String type;
}
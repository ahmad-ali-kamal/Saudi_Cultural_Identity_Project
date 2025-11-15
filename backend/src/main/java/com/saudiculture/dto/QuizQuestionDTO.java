package com.saudiculture.dto;

import lombok.Data;

@Data
public class QuizQuestionDTO {
    private String id;
    private String questionText;
    private String[] options;
    private String answer;
    private String language;
    private String region;
    private String type;
    private String category;

    private String imageBase64;
    private String imageMimeType;
}
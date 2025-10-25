package com.saudiculture.dto;

import lombok.Data;

@Data
public class InfoQuestionDTO {
    private String questionText;
    private String answer;
    private String category;
    private String language;
    private String region;
}
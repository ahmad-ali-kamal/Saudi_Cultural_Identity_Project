package com.saudiculture.dto;

import lombok.Data;

@Data
public class InfoQuestionDTO {
    private String questionText;
    private String answer;
    private String category;
    private String language;
    private String region;

    // Image fields - base64 encoded for JSON transport
    private String imageBase64;
    private String imageMimeType;
}
package com.saudiculture.data;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class QuestionCsvRecord {

    @CsvBindByName(column = "Question")
    private String question;

    @CsvBindByName(column = "Choices")
    private String choices;

    @CsvBindByName(column = "Answer")
    private String answer;

    @CsvBindByName(column = "Question Type")
    private String questionType;

    @CsvBindByName(column = "Domain")
    private String domain;

    @CsvBindByName(column = "Category")
    private String category;

    @CsvBindByName(column = "Language")
    private String language;

    // Metadata columns - not mapped to Question model, used for statistics
    @CsvBindByName(column = "The Count of Category")
    private String countOfCategory;

    @CsvBindByName(column = "Type")
    private String type;
}

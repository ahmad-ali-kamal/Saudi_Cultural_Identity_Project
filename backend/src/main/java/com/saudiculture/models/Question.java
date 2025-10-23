package com.saudiculture.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "questions")
public class Question {

  @Id
  private String id;

  private String term;

  @Field("term_meaning")
  private String termMeaning;

  @Field("question_text")
  @NotBlank(message = "Question text cannot be blank")
  private String questionText;

  private String[] options;

  @NotBlank(message = "Answer cannot be blank")
  private String answer;

  @NotBlank(message = "Category cannot be blank")
  private String category;

  @NotBlank(message = "Type cannot be blank")
  private String type;

  @NotBlank(message = "Language cannot be blank")
  private String language;


}

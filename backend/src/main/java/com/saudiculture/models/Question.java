package com.saudiculture.models;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "questions")
@CompoundIndex(name = "category_region_index", def = "{'category': 1, 'region': 1}")
@CompoundIndex(name = "category_type_index", def = "{'category': 1, 'type': 1}")
@CompoundIndex(name = "region_type_index", def = "{'region': 1, 'type': 1}")
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

  @NotBlank(message = "Region cannot be blank")
  private String region;
}

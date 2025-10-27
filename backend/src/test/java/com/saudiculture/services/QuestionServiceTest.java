package com.saudiculture.services;

import com.saudiculture.dto.InfoQuestionDTO;
import com.saudiculture.models.Question;
import com.saudiculture.repositories.QuestionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuestionService Tests")
class QuestionServiceTest {

  @Mock
  private QuestionRepository questionRepository;

  @Mock
  private MongoTemplate mongoTemplate;

  @InjectMocks
  private QuestionService questionService;

  private Question sampleQuestion;

  @BeforeEach
  void setUp() {
    sampleQuestion = createSampleQuestion();
  }

  @Test
  @DisplayName("Should return paginated info questions when no filters applied")
  void shouldReturnPaginatedInfoQuestionsWhenNoFilters() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findAll(any(Pageable.class))).thenReturn(samplePage);

    Page<InfoQuestionDTO> response = questionService.getInfo(null, null, 0, 20);
    assertThat(response.getTotalElements()).isEqualTo(1);

    verify(questionRepository, times(1)).findAll(any(Pageable.class));
  }

  @Test
  @DisplayName("Should filter by category when category provided")
  void shouldFilterByCategoryWhenCategoryProvided() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findByCategory(eq("food"), any(Pageable.class))).thenReturn(samplePage);
    Page<InfoQuestionDTO> response = questionService.getInfo("food", null, 0, 20);
    assertThat(response.getTotalElements()).isEqualTo(1);
    verify(questionRepository, times(1)).findByCategory(eq("food"), any(Pageable.class));
    verify(questionRepository, never()).findAll(any(Pageable.class));
  }

  @Test
  @DisplayName("Should filter by category and region when both provided")
  void shouldFilterByCategoryAndRegionWhenBothProvided() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findByCategoryAndRegion(eq("food"), eq("west"),
        any(Pageable.class))).thenReturn(samplePage);
    Page<InfoQuestionDTO> response = questionService.getInfo("food", "west", 0, 20);
    assertThat(response.getTotalElements()).isEqualTo(1);
    verify(questionRepository, times(1)).findByCategoryAndRegion(eq("food"), eq("west"),
        any(Pageable.class));
    verify(questionRepository, never()).findAll(any(Pageable.class));
  }

  @Test
  @DisplayName("Should convert Question to InfoQuestionDTO correctly")
  void shouldConvertQuestionToInfoQuestionDTO() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findAll(any(Pageable.class))).thenReturn(samplePage);
    Page<InfoQuestionDTO> response = questionService.getInfo(null, null, 0, 20);
    assertThat(response.getTotalElements()).isEqualTo(1);
    assertThat(response.getContent().getFirst().getQuestionText()).isEqualTo("What is the traditional dance in Saudi Arabia?");
    assertThat(response.getContent().getFirst().getAnswer()).isEqualTo("Al-Ardah");
    assertThat(response.getContent().getFirst().getCategory()).isEqualTo("culture");
    assertThat(response.getContent().getFirst().getLanguage()).isEqualTo("english");
  }

  // Helper method to create a sample question
  private Question createSampleQuestion() {
    Question question = new Question();
    question.setId("123");
    question.setQuestionText("What is the traditional dance in Saudi Arabia?");
    question.setAnswer("Al-Ardah");
    question.setCategory("culture");
    question.setType("open-ended");
    question.setLanguage("english");
    question.setRegion("general");
    question.setOptions(new String[]{"Al-Ardah", "Dabke", "Tanoura"});
    return question;
  }
}

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
  @DisplayName("Should return paginated info questions when only language provided")
  void shouldReturnPaginatedInfoQuestionsWithLanguageFilter() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findByContentLanguage(eq("Arabic"), any(Pageable.class))).thenReturn(samplePage);

    Page<InfoQuestionDTO> response = questionService.getInfo("Arabic", null, null, null, 0, 20);

    assertThat(response.getTotalElements()).isEqualTo(1);
    assertThat(response.getContent()).hasSize(1);
    verify(questionRepository, times(1)).findByContentLanguage(eq("Arabic"), any(Pageable.class));
  }

  @Test
  @DisplayName("Should filter by language and category when both provided")
  void shouldFilterByLanguageAndCategory() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findByContentLanguageAndCategory(eq("English"), eq("culture"), any(Pageable.class)))
        .thenReturn(samplePage);

    Page<InfoQuestionDTO> response = questionService.getInfo("English", "culture", null, null, 0, 20);

    assertThat(response.getTotalElements()).isEqualTo(1);
    verify(questionRepository, times(1)).findByContentLanguageAndCategory(eq("English"), eq("culture"), any(Pageable.class));
  }

  @Test
  @DisplayName("Should filter by language, category and region when all provided")
  void shouldFilterByLanguageCategoryAndRegion() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findByContentLanguageAndCategoryAndRegion(
        eq("English"), eq("culture"), eq("general"), any(Pageable.class))).thenReturn(samplePage);

    Page<InfoQuestionDTO> response = questionService.getInfo("English", "culture", "general", null, 0, 20);

    assertThat(response.getTotalElements()).isEqualTo(1);
    verify(questionRepository, times(1)).findByContentLanguageAndCategoryAndRegion(
        eq("English"), eq("culture"), eq("general"), any(Pageable.class));
  }

  @Test
  @DisplayName("Should convert Question to InfoQuestionDTO correctly")
  void shouldConvertQuestionToInfoQuestionDTO() {
    Page<Question> samplePage = new PageImpl<>(List.of(sampleQuestion), PageRequest.of(0, 20), 1);
    when(questionRepository.findByContentLanguage(eq("English"), any(Pageable.class))).thenReturn(samplePage);

    Page<InfoQuestionDTO> response = questionService.getInfo("English", null, null, null, 0, 20);

    assertThat(response.getTotalElements()).isEqualTo(1);
    InfoQuestionDTO dto = response.getContent().getFirst();
    assertThat(dto.getQuestionText()).isEqualTo("What is the traditional dance in Saudi Arabia?");
    assertThat(dto.getAnswer()).isEqualTo("Al-Ardah");
    assertThat(dto.getCategory()).isEqualTo("culture");
    assertThat(dto.getLanguage()).isEqualTo("English");
  }

  // Helper method to create a sample question
  private Question createSampleQuestion() {
    Question question = new Question();
    question.setId("123");
    question.setQuestionText("What is the traditional dance in Saudi Arabia?");
    question.setAnswer("Al-Ardah");
    question.setCategory("culture");
    question.setType("open_ended");
    question.setContentLanguage("English");
    question.setRegion("general");
    question.setOptions(new String[]{"Al-Ardah", "Dabke", "Tanoura"});
    return question;
  }
}

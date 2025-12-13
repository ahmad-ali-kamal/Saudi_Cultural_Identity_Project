package com.saudiculture.services;

import com.saudiculture.dto.QuizSubmissionRequest;
import com.saudiculture.dto.QuizSubmissionResponse;
import com.saudiculture.models.Question;
import com.saudiculture.models.QuizSubmission;
import com.saudiculture.repositories.QuestionRepository;
import com.saudiculture.repositories.QuizSubmissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuizSubmissionService Tests")
class QuizSubmissionServiceTest {

  @Mock
  private QuizSubmissionRepository quizSubmissionRepository;

  @Mock
  private QuestionRepository questionRepository;

  @InjectMocks
  private QuizSubmissionService quizSubmissionService;

  private List<Question> sampleQuestions;

  @BeforeEach
  void setUp() {
    sampleQuestions = createSampleQuestions();
  }

  @Test
  @DisplayName("Should submit quiz and calculate score correctly for mixed question types")
  void shouldSubmitQuizAndCalculateScoreCorrectly() {
    // Arrange
    QuizSubmissionRequest request = new QuizSubmissionRequest(List.of(
        new QuizSubmissionRequest.AnswerInput("q1", "الكبسة"),           // Correct
        new QuizSubmissionRequest.AnswerInput("q2", "Option A"),        // Correct
        new QuizSubmissionRequest.AnswerInput("q3", "Option A,Option B"), // Correct
        new QuizSubmissionRequest.AnswerInput("q4", "صح")                // Correct
    ));

    when(questionRepository.findAllById(anyList())).thenReturn(sampleQuestions);
    when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenAnswer(invocation -> {
      QuizSubmission submission = invocation.getArgument(0);
      submission.setId("submission-123");
      return submission;
    });

    // Act
    QuizSubmissionResponse response = quizSubmissionService.submitQuiz(request, "user-123");

    // Assert
    assertThat(response).isNotNull();
    assertThat(response.score()).isEqualTo(4);
    assertThat(response.totalQuestions()).isEqualTo(4);
    assertThat(response.percentage()).isEqualTo(100.0);
    verify(quizSubmissionRepository, times(1)).save(any(QuizSubmission.class));
  }

  @Test
  @DisplayName("Should handle incorrect answers and calculate partial score")
  void shouldHandleIncorrectAnswersAndCalculatePartialScore() {
    // Arrange
    QuizSubmissionRequest request = new QuizSubmissionRequest(List.of(
        new QuizSubmissionRequest.AnswerInput("q1", "المندي"),           // Incorrect
        new QuizSubmissionRequest.AnswerInput("q2", "Option B"),        // Incorrect
        new QuizSubmissionRequest.AnswerInput("q3", "Option A"),        // Incorrect (partial)
        new QuizSubmissionRequest.AnswerInput("q4", "صح")                // Correct
    ));

    when(questionRepository.findAllById(anyList())).thenReturn(sampleQuestions);
    when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenAnswer(invocation -> {
      QuizSubmission submission = invocation.getArgument(0);
      submission.setId("submission-456");
      return submission;
    });

    // Act
    QuizSubmissionResponse response = quizSubmissionService.submitQuiz(request, "user-123");

    // Assert
    assertThat(response).isNotNull();
    assertThat(response.score()).isEqualTo(1); // Only true/false question correct
    assertThat(response.totalQuestions()).isEqualTo(4);
    assertThat(response.percentage()).isEqualTo(25.0);
  }

  @Test
  @DisplayName("Should throw exception when question not found")
  void shouldThrowExceptionWhenQuestionNotFound() {
    // Arrange
    QuizSubmissionRequest request = new QuizSubmissionRequest(List.of(
        new QuizSubmissionRequest.AnswerInput("non-existent-id", "answer")
    ));

    when(questionRepository.findAllById(anyList())).thenReturn(List.of()); // No questions found

    // Act & Assert
    assertThatThrownBy(() -> quizSubmissionService.submitQuiz(request, "user-123"))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Question not found");
  }

  @Test
  @DisplayName("Should handle multiple choice with different answer order")
  void shouldHandleMultipleChoiceWithDifferentOrder() {
    // Arrange
    QuizSubmissionRequest request = new QuizSubmissionRequest(List.of(
        new QuizSubmissionRequest.AnswerInput("q3", "Option B,Option A") // Different order but correct
    ));

    List<Question> questions = List.of(sampleQuestions.get(2)); // Multiple choice question
    when(questionRepository.findAllById(anyList())).thenReturn(questions);
    when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenAnswer(invocation -> {
      QuizSubmission submission = invocation.getArgument(0);
      submission.setId("submission-789");
      return submission;
    });

    // Act
    QuizSubmissionResponse response = quizSubmissionService.submitQuiz(request, "user-123");

    // Assert
    assertThat(response.score()).isEqualTo(1);
    assertThat(response.answers().get(0).correct()).isTrue();
  }

  @Test
  @DisplayName("Should handle true/false questions with Arabic variants")
  void shouldHandleTrueFalseWithArabicVariants() {
    // Arrange
    QuizSubmissionRequest requestWithSah = new QuizSubmissionRequest(List.of(
        new QuizSubmissionRequest.AnswerInput("q4", "صح") // True in Arabic
    ));
    QuizSubmissionRequest requestWithKhata = new QuizSubmissionRequest(List.of(
        new QuizSubmissionRequest.AnswerInput("q5", "خطأ") // False in Arabic
    ));

    List<Question> trueQuestion = List.of(sampleQuestions.get(3)); // True/False with "صح" answer
    List<Question> falseQuestion = List.of(createFalseQuestion()); // True/False with "خطأ" answer

    when(questionRepository.findAllById(anyList()))
        .thenReturn(trueQuestion)
        .thenReturn(falseQuestion);
    when(quizSubmissionRepository.save(any(QuizSubmission.class))).thenAnswer(invocation -> {
      QuizSubmission submission = invocation.getArgument(0);
      submission.setId("submission-" + System.currentTimeMillis());
      return submission;
    });

    // Act
    QuizSubmissionResponse response1 = quizSubmissionService.submitQuiz(requestWithSah, "user-123");
    QuizSubmissionResponse response2 = quizSubmissionService.submitQuiz(requestWithKhata, "user-123");

    // Assert
    assertThat(response1.score()).isEqualTo(1);
    assertThat(response2.score()).isEqualTo(1);
  }

  // Helper methods
  private List<Question> createSampleQuestions() {
    Question q1 = new Question();
    q1.setId("q1");
    q1.setQuestionText("ما هو الطبق التقليدي في السعودية؟");
    q1.setAnswer("الكبسة");
    q1.setType("open_ended");
    q1.setContentLanguage("Arabic");
    q1.setCategory("Traditional Food");
    q1.setRegion("GENERAL");

    Question q2 = new Question();
    q2.setId("q2");
    q2.setQuestionText("What is the capital of Saudi Arabia?");
    q2.setAnswer("Option A");
    q2.setOptions(new String[]{"Option A", "Option B", "Option C"});
    q2.setType("single_choice");
    q2.setContentLanguage("English");
    q2.setCategory("Geography");
    q2.setRegion("GENERAL");

    Question q3 = new Question();
    q3.setId("q3");
    q3.setQuestionText("Select all that apply");
    q3.setAnswer("Option A,Option B");
    q3.setOptions(new String[]{"Option A", "Option B", "Option C", "Option D"});
    q3.setType("multiple_choice");
    q3.setContentLanguage("English");
    q3.setCategory("Culture");
    q3.setRegion("GENERAL");

    Question q4 = new Question();
    q4.setId("q4");
    q4.setQuestionText("هل الرياض عاصمة السعودية؟");
    q4.setAnswer("صح");
    q4.setOptions(new String[]{"صح", "خطأ"});
    q4.setType("true_false");
    q4.setContentLanguage("Arabic");
    q4.setCategory("Geography");
    q4.setRegion("GENERAL");

    return List.of(q1, q2, q3, q4);
  }

  private Question createFalseQuestion() {
    Question q = new Question();
    q.setId("q5");
    q.setQuestionText("هل جدة عاصمة السعودية؟");
    q.setAnswer("خطأ");
    q.setOptions(new String[]{"صح", "خطأ"});
    q.setType("true_false");
    q.setContentLanguage("Arabic");
    q.setCategory("Geography");
    q.setRegion("WEST");
    return q;
  }
}

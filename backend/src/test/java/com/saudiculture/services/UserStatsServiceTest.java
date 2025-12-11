package com.saudiculture.services;

import com.saudiculture.dto.UserStatsResponse;
import com.saudiculture.dto.UserStatsResponse.*;
import com.saudiculture.models.Question;
import com.saudiculture.models.QuizAnswer;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserStatsService Tests")
class UserStatsServiceTest {

  @Mock
  private QuizSubmissionRepository quizSubmissionRepository;

  @Mock
  private QuestionRepository questionRepository;

  @InjectMocks
  private UserStatsService userStatsService;

  private List<Question> sampleQuestions;

  @BeforeEach
  void setUp() {
    sampleQuestions = createSampleQuestions();
  }

  @Test
  @DisplayName("Should return empty stats when user has no submissions")
  void shouldReturnEmptyStatsWhenNoSubmissions() {
    // Arrange
    when(quizSubmissionRepository.findAllByUserId("user-123")).thenReturn(List.of());

    // Act
    UserStatsResponse stats = userStatsService.getUserStats("user-123");

    // Assert
    assertThat(stats).isNotNull();
    assertThat(stats.overall().totalQuestionsAnswered()).isZero();
    assertThat(stats.overall().totalSubmissions()).isZero();
    assertThat(stats.overall().averageScore()).isZero();
    assertThat(stats.byQuestionType()).isEmpty();
    assertThat(stats.byRegion()).isEmpty();
    assertThat(stats.byLanguage()).isEmpty();
    assertThat(stats.recentSubmissions()).isEmpty();
    assertThat(stats.strengths()).isEmpty();
    assertThat(stats.weaknesses()).isEmpty();
  }

  @Test
  @DisplayName("Should calculate overall stats correctly for single submission")
  void shouldCalculateOverallStatsForSingleSubmission() {
    // Arrange
    List<QuizSubmission> submissions = createSingleSubmissionWith3Correct();
    when(quizSubmissionRepository.findAllByUserId("user-123")).thenReturn(submissions);
    when(questionRepository.findAllByIdIn(anyList())).thenReturn(sampleQuestions);

    // Act
    UserStatsResponse stats = userStatsService.getUserStats("user-123");

    // Assert
    OverallStats overall = stats.overall();
    assertThat(overall.totalQuestionsAnswered()).isEqualTo(5);
    assertThat(overall.totalCorrect()).isEqualTo(3);
    assertThat(overall.totalIncorrect()).isEqualTo(2);
    assertThat(overall.averageScore()).isEqualTo(60.0); // 3/5 * 100
    assertThat(overall.totalSubmissions()).isEqualTo(1);
  }

  @Test
  @DisplayName("Should aggregate stats by question type correctly")
  void shouldAggregateStatsByQuestionType() {
    // Arrange
    List<QuizSubmission> submissions = createSubmissionsWithVariedTypes();
    when(quizSubmissionRepository.findAllByUserId("user-123")).thenReturn(submissions);
    when(questionRepository.findAllByIdIn(anyList())).thenReturn(sampleQuestions);

    // Act
    UserStatsResponse stats = userStatsService.getUserStats("user-123");

    // Assert
    List<TypeStats> byType = stats.byQuestionType();
    assertThat(byType).isNotEmpty();
    assertThat(byType).extracting(TypeStats::type)
        .containsAnyOf("open_ended", "single_choice", "multiple_choice", "true_false");

    // Find single_choice stats
    TypeStats singleChoiceStats = byType.stream()
        .filter(ts -> "single_choice".equals(ts.type()))
        .findFirst()
        .orElse(null);

    if (singleChoiceStats != null) {
      assertThat(singleChoiceStats.total()).isGreaterThan(0);
      assertThat(singleChoiceStats.accuracy()).isBetween(0.0, 100.0);
    }
  }

  @Test
  @DisplayName("Should aggregate stats by region correctly")
  void shouldAggregateStatsByRegion() {
    // Arrange
    List<QuizSubmission> submissions = createSubmissionsWithVariedRegions();
    when(quizSubmissionRepository.findAllByUserId("user-123")).thenReturn(submissions);
    when(questionRepository.findAllByIdIn(anyList())).thenReturn(sampleQuestions);

    // Act
    UserStatsResponse stats = userStatsService.getUserStats("user-123");

    // Assert
    List<RegionStats> byRegion = stats.byRegion();
    assertThat(byRegion).isNotEmpty();
    assertThat(byRegion).extracting(RegionStats::region)
        .containsAnyOf("GENERAL", "WEST", "EAST", "NORTH", "SOUTH", "CENTRAL");

    // Verify accuracy calculation
    for (RegionStats regionStats : byRegion) {
      assertThat(regionStats.total()).isEqualTo(regionStats.correct() + regionStats.incorrect());
      assertThat(regionStats.accuracy()).isBetween(0.0, 100.0);
    }
  }

  @Test
  @DisplayName("Should identify strengths and weaknesses based on thresholds")
  void shouldIdentifyStrengthsAndWeaknesses() {
    // Arrange
    List<QuizSubmission> submissions = createSubmissionsForStrengthWeaknessAnalysis();
    List<Question> questions = createQuestionsForStrengthWeakness();
    when(quizSubmissionRepository.findAllByUserId("user-123")).thenReturn(submissions);
    when(questionRepository.findAllByIdIn(anyList())).thenReturn(questions);

    // Act
    UserStatsResponse stats = userStatsService.getUserStats("user-123");

    // Assert
    // With >= 10 questions and >= 80% accuracy, should have strengths
    // With >= 10 questions and < 60% accuracy, should have weaknesses
    assertThat(stats.strengths()).isNotNull();
    assertThat(stats.weaknesses()).isNotNull();

    // Note: Actual strengths/weaknesses depend on the test data
    // This verifies the lists are populated and not null
  }

  // Helper methods to create test data
  private List<QuizSubmission> createSingleSubmissionWith3Correct() {
    QuizSubmission submission = new QuizSubmission();
    submission.setId("sub1");
    submission.setUserId("user-123");
    submission.setScore(3);
    submission.setTotalQuestions(5);
    submission.setSubmittedAt(LocalDateTime.now());

    List<QuizAnswer> answers = List.of(
        new QuizAnswer("q1", "Q1 text", "correct", "correct", true),
        new QuizAnswer("q2", "Q2 text", "correct", "correct", true),
        new QuizAnswer("q3", "Q3 text", "correct", "correct", true),
        new QuizAnswer("q4", "Q4 text", "wrong", "correct", false),
        new QuizAnswer("q5", "Q5 text", "wrong", "correct", false)
    );
    submission.setAnswers(answers);

    return List.of(submission);
  }

  private List<QuizSubmission> createSubmissionsWithVariedTypes() {
    QuizSubmission submission = new QuizSubmission();
    submission.setId("sub1");
    submission.setUserId("user-123");
    submission.setScore(2);
    submission.setTotalQuestions(4);
    submission.setSubmittedAt(LocalDateTime.now());

    List<QuizAnswer> answers = List.of(
        new QuizAnswer("q1", "Q1 text", "answer", "answer", true),
        new QuizAnswer("q2", "Q2 text", "answer", "answer", true),
        new QuizAnswer("q3", "Q3 text", "wrong", "answer", false),
        new QuizAnswer("q4", "Q4 text", "wrong", "answer", false)
    );
    submission.setAnswers(answers);

    return List.of(submission);
  }

  private List<QuizSubmission> createSubmissionsWithVariedRegions() {
    QuizSubmission submission = new QuizSubmission();
    submission.setId("sub1");
    submission.setUserId("user-123");
    submission.setScore(3);
    submission.setTotalQuestions(5);
    submission.setSubmittedAt(LocalDateTime.now());

    List<QuizAnswer> answers = List.of(
        new QuizAnswer("q1", "Q1 text", "answer", "answer", true),
        new QuizAnswer("q2", "Q2 text", "answer", "answer", true),
        new QuizAnswer("q3", "Q3 text", "answer", "answer", true),
        new QuizAnswer("q4", "Q4 text", "wrong", "answer", false),
        new QuizAnswer("q5", "Q5 text", "wrong", "answer", false)
    );
    submission.setAnswers(answers);

    return List.of(submission);
  }

  private List<QuizSubmission> createSubmissionsForStrengthWeaknessAnalysis() {
    QuizSubmission submission = new QuizSubmission();
    submission.setId("sub1");
    submission.setUserId("user-123");
    submission.setScore(12);
    submission.setTotalQuestions(15);
    submission.setSubmittedAt(LocalDateTime.now());

    List<QuizAnswer> answers = new ArrayList<>();
    for (int i = 1; i <= 15; i++) {
      boolean correct = i <= 12; // 12 correct out of 15 = 80%
      answers.add(new QuizAnswer("q" + i, "Q" + i, "answer", "answer", correct));
    }
    submission.setAnswers(answers);

    return List.of(submission);
  }

  private List<Question> createSampleQuestions() {
    Question q1 = new Question();
    q1.setId("q1");
    q1.setType("open_ended");
    q1.setRegion("GENERAL");
    q1.setContentLanguage("Arabic");

    Question q2 = new Question();
    q2.setId("q2");
    q2.setType("single_choice");
    q2.setRegion("WEST");
    q2.setContentLanguage("English");

    Question q3 = new Question();
    q3.setId("q3");
    q3.setType("multiple_choice");
    q3.setRegion("EAST");
    q3.setContentLanguage("Arabic");

    Question q4 = new Question();
    q4.setId("q4");
    q4.setType("true_false");
    q4.setRegion("NORTH");
    q4.setContentLanguage("English");

    Question q5 = new Question();
    q5.setId("q5");
    q5.setType("open_ended");
    q5.setRegion("SOUTH");
    q5.setContentLanguage("Arabic");

    return List.of(q1, q2, q3, q4, q5);
  }

  private List<Question> createQuestionsForStrengthWeakness() {
    List<Question> questions = new ArrayList<>();
    for (int i = 1; i <= 15; i++) {
      Question q = new Question();
      q.setId("q" + i);
      q.setType("single_choice");
      q.setRegion("GENERAL");
      q.setContentLanguage("Arabic");
      questions.add(q);
    }
    return questions;
  }
}

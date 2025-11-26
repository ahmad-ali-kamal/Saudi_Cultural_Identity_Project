package com.saudiculture.services;

import com.saudiculture.dto.UserStatsResponse;
import com.saudiculture.dto.UserStatsResponse.*;
import com.saudiculture.models.Question;
import com.saudiculture.models.QuizAnswer;
import com.saudiculture.models.QuizSubmission;
import com.saudiculture.repositories.QuestionRepository;
import com.saudiculture.repositories.QuizSubmissionRepository;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserStatsService {

  private final QuizSubmissionRepository quizSubmissionRepository;
  private final QuestionRepository questionRepository;

  private static final double STRENGTH_THRESHOLD = 80.0;
  private static final double WEAKNESS_THRESHOLD = 60.0;
  private static final int MIN_QUESTIONS_FOR_ANALYSIS = 10;

  /**
   * Get comprehensive statistics for a user's quiz performance
   *
   * @param userId The internal MongoDB user ID
   * @return Aggregated statistics including overall, by type, by region, by language, recent submissions, and strengths/weaknesses
   */
  public UserStatsResponse getUserStats(String userId) {
    log.info("Calculating stats for user: {}", userId);

    // Fetch all user submissions
    List<QuizSubmission> submissions = quizSubmissionRepository.findAllByUserId(userId);

    if (submissions.isEmpty()) {
      return createEmptyStats();
    }

    // Extract all unique question IDs from all submissions
    Set<String> questionIds = submissions.stream()
        .flatMap(sub -> sub.getAnswers().stream())
        .map(QuizAnswer::questionId)
        .collect(Collectors.toSet());

    // Batch fetch all questions
    List<Question> questions = questionRepository.findAllByIdIn(new ArrayList<>(questionIds));
    Map<String, Question> questionMap = questions.stream()
        .collect(Collectors.toMap(Question::getId, q -> q));

    // Calculate all statistics
    OverallStats overall = calculateOverallStats(submissions);
    List<TypeStats> byType = aggregateByQuestionType(submissions, questionMap);
    List<RegionStats> byRegion = aggregateByRegion(submissions, questionMap);
    List<LanguageStats> byLanguage = aggregateByLanguage(submissions, questionMap);
    List<RecentSubmission> recent = getRecentSubmissions(submissions, 10);

    // Identify strengths and weaknesses
    List<String> strengths = new ArrayList<>();
    List<String> weaknesses = new ArrayList<>();
    identifyStrengthsWeaknesses(byType, byRegion, byLanguage, strengths, weaknesses);

    log.info("Stats calculated for user {}: {} questions, {}% average",
        userId, overall.totalQuestionsAnswered(), overall.averageScore());

    return new UserStatsResponse(overall, byType, byRegion, byLanguage, recent, strengths, weaknesses);
  }

  /**
   * Calculate overall statistics across all submissions
   */
  private OverallStats calculateOverallStats(List<QuizSubmission> submissions) {
    int totalQuestions = submissions.stream()
        .mapToInt(QuizSubmission::getTotalQuestions)
        .sum();

    int totalCorrect = submissions.stream()
        .flatMap(sub -> sub.getAnswers().stream())
        .mapToInt(answer -> Boolean.TRUE.equals(answer.correct()) ? 1 : 0)
        .sum();

    int totalIncorrect = totalQuestions - totalCorrect;

    double averageScore = submissions.stream()
        .mapToDouble(sub -> (double) sub.getScore() / sub.getTotalQuestions() * 100)
        .average()
        .orElse(0.0);

    return new OverallStats(
        totalQuestions,
        totalCorrect,
        totalIncorrect,
        Math.round(averageScore * 100) / 100.0,
        submissions.size()
    );
  }

  /**
   * Aggregate statistics by question type
   */
  private List<TypeStats> aggregateByQuestionType(
      List<QuizSubmission> submissions,
      Map<String, Question> questionMap) {

    Map<String, StatsAccumulator> typeAccumulators = new HashMap<>();

    submissions.forEach(submission ->
        submission.getAnswers().forEach(answer -> {
          Question question = questionMap.get(answer.questionId());
          if (question != null && question.getType() != null) {
            String type = question.getType();
            typeAccumulators.computeIfAbsent(type, k -> new StatsAccumulator())
                .add(answer.correct());
          }
        })
    );

    return typeAccumulators.entrySet().stream()
        .map(entry -> new TypeStats(
            entry.getKey(),
            entry.getValue().total,
            entry.getValue().correct,
            entry.getValue().incorrect,
            entry.getValue().getAccuracy()
        ))
        .sorted(Comparator.comparing(TypeStats::type))
        .collect(Collectors.toList());
  }

  /**
   * Aggregate statistics by region
   */
  private List<RegionStats> aggregateByRegion(
      List<QuizSubmission> submissions,
      Map<String, Question> questionMap) {

    Map<String, StatsAccumulator> regionAccumulators = new HashMap<>();

    submissions.forEach(submission ->
        submission.getAnswers().forEach(answer -> {
          Question question = questionMap.get(answer.questionId());
          if (question != null && question.getRegion() != null) {
            String region = question.getRegion();
            regionAccumulators.computeIfAbsent(region, k -> new StatsAccumulator())
                .add(answer.correct());
          }
        })
    );

    return regionAccumulators.entrySet().stream()
        .map(entry -> new RegionStats(
            entry.getKey(),
            entry.getValue().total,
            entry.getValue().correct,
            entry.getValue().incorrect,
            entry.getValue().getAccuracy()
        ))
        .sorted(Comparator.comparing(RegionStats::region))
        .collect(Collectors.toList());
  }

  /**
   * Aggregate statistics by content language
   */
  private List<LanguageStats> aggregateByLanguage(
      List<QuizSubmission> submissions,
      Map<String, Question> questionMap) {

    Map<String, StatsAccumulator> languageAccumulators = new HashMap<>();

    submissions.forEach(submission ->
        submission.getAnswers().forEach(answer -> {
          Question question = questionMap.get(answer.questionId());
          if (question != null && question.getContentLanguage() != null) {
            String language = question.getContentLanguage();
            languageAccumulators.computeIfAbsent(language, k -> new StatsAccumulator())
                .add(answer.correct());
          }
        })
    );

    return languageAccumulators.entrySet().stream()
        .map(entry -> new LanguageStats(
            entry.getKey(),
            entry.getValue().total,
            entry.getValue().correct,
            entry.getValue().incorrect,
            entry.getValue().getAccuracy()
        ))
        .sorted(Comparator.comparing(LanguageStats::language))
        .collect(Collectors.toList());
  }

  /**
   * Get recent submissions ordered by date descending
   */
  private List<RecentSubmission> getRecentSubmissions(List<QuizSubmission> submissions, int limit) {
    return submissions.stream()
        .sorted(Comparator.comparing(QuizSubmission::getSubmittedAt).reversed())
        .limit(limit)
        .map(sub -> new RecentSubmission(
            sub.getId(),
            sub.getSubmittedAt(),
            sub.getScore(),
            sub.getTotalQuestions(),
            Math.round((double) sub.getScore() / sub.getTotalQuestions() * 10000) / 100.0
        ))
        .collect(Collectors.toList());
  }

  /**
   * Identify strengths (>80% accuracy) and weaknesses (<60% accuracy)
   * Requires minimum number of questions to avoid false positives
   */
  private void identifyStrengthsWeaknesses(
      List<TypeStats> byType,
      List<RegionStats> byRegion,
      List<LanguageStats> byLanguage,
      List<String> strengths,
      List<String> weaknesses) {

    // Analyze question types
    byType.forEach(stat -> {
      if (stat.total() >= MIN_QUESTIONS_FOR_ANALYSIS) {
        if (stat.accuracy() >= STRENGTH_THRESHOLD) {
          strengths.add(stat.type());
        } else if (stat.accuracy() < WEAKNESS_THRESHOLD) {
          weaknesses.add(stat.type());
        }
      }
    });

    // Analyze regions
    byRegion.forEach(stat -> {
      if (stat.total() >= MIN_QUESTIONS_FOR_ANALYSIS) {
        if (stat.accuracy() >= STRENGTH_THRESHOLD) {
          strengths.add(stat.region());
        } else if (stat.accuracy() < WEAKNESS_THRESHOLD) {
          weaknesses.add(stat.region());
        }
      }
    });

    // Analyze languages
    byLanguage.forEach(stat -> {
      if (stat.total() >= MIN_QUESTIONS_FOR_ANALYSIS) {
        if (stat.accuracy() >= STRENGTH_THRESHOLD) {
          strengths.add(stat.language());
        } else if (stat.accuracy() < WEAKNESS_THRESHOLD) {
          weaknesses.add(stat.language());
        }
      }
    });
  }

  /**
   * Create empty stats response for users with no submissions
   */
  private UserStatsResponse createEmptyStats() {
    return new UserStatsResponse(
        new OverallStats(0, 0, 0, 0.0, 0),
        List.of(),
        List.of(),
        List.of(),
        List.of(),
        List.of(),
        List.of()
    );
  }

  /**
   * Helper class to accumulate statistics
   */
  private static class StatsAccumulator {
    int total = 0;
    int correct = 0;
    int incorrect = 0;

    void add(Boolean isCorrect) {
      total++;
      if (Boolean.TRUE.equals(isCorrect)) {
        correct++;
      } else {
        incorrect++;
      }
    }

    double getAccuracy() {
      return total == 0 ? 0.0 : Math.round((double) correct / total * 10000) / 100.0;
    }
  }
}

package com.saudiculture.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for user quiz statistics endpoint
 * Contains aggregated performance data across multiple dimensions
 */
public record UserStatsResponse(
    OverallStats overall,
    List<TypeStats> byQuestionType,
    List<RegionStats> byRegion,
    List<LanguageStats> byLanguage,
    List<RecentSubmission> recentSubmissions,
    List<String> strengths,
    List<String> weaknesses
) {

  /**
   * Overall aggregated statistics across all submissions
   */
  public record OverallStats(
      Integer totalQuestionsAnswered,
      Integer totalCorrect,
      Integer totalIncorrect,
      Double averageScore,
      Integer totalSubmissions
  ) {}

  /**
   * Statistics grouped by question type (single_choice, true_false, open_ended, etc.)
   */
  public record TypeStats(
      String type,
      Integer total,
      Integer correct,
      Integer incorrect,
      Double accuracy
  ) {}

  /**
   * Statistics grouped by Saudi region (WEST, EAST, NORTH, SOUTH, CENTRAL, GENERAL)
   */
  public record RegionStats(
      String region,
      Integer total,
      Integer correct,
      Integer incorrect,
      Double accuracy
  ) {}

  /**
   * Statistics grouped by content language (Arabic, English)
   */
  public record LanguageStats(
      String language,
      Integer total,
      Integer correct,
      Integer incorrect,
      Double accuracy
  ) {}

  /**
   * Individual recent quiz submission summary
   */
  public record RecentSubmission(
      String id,
      LocalDateTime submittedAt,
      Integer score,
      Integer totalQuestions,
      Double percentage
  ) {}
}

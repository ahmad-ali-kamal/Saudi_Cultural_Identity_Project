package com.saudiculture.data;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.saudiculture.models.Question;
import com.saudiculture.repositories.QuestionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@Component
@Slf4j
public class DataLoader {

  private final QuestionRepository questionRepository;
  private final ApplicationContext applicationContext;
  private final QuestionValidator validator;

  @Value("${csv.loading.enabled:true}")
  private boolean loadingEnabled;

  @Value("${csv.loading.retries:5}")
  private int retries;

  @Value("${csv.loading.retry-delay-ms:2000}")
  private long retryDelayMs;

  @Value("${csv.loading.log-errors:true}")
  private boolean logErrors;

  @Value("${csv.loading.log-warnings:false}")
  private boolean logWarnings;

  public DataLoader(QuestionRepository questionRepository,
      ApplicationContext applicationContext,
      QuestionValidator validator) {
    this.questionRepository = questionRepository;
    this.applicationContext = applicationContext;
    this.validator = validator;
  }

  @EventListener(ContextRefreshedEvent.class)
  public void run() throws InterruptedException {
    if (!loadingEnabled) {
      log.info("CSV loading is disabled");
      return;
    }

    if (!checkDatabaseEmpty()) {
      log.info("Database is not empty, skipping CSV loading");
      return;
    }

    log.info("Starting CSV loading");
    loadDataFromCsv();
  }

  private boolean checkDatabaseEmpty() throws InterruptedException {
    for (int i = 0; i < retries; i++) {
      try {
        return questionRepository.count() == 0;
      } catch (Exception e) {
        if (i < retries - 1) {
          Thread.sleep(retryDelayMs);
        } else {
          return false;
        }
      }
    }
    return true;
  }

  private void loadDataFromCsv() {
    try {
      Resource[] resources = applicationContext.getResources("classpath:data/*.csv");
      List<CsvLoadResult> results = new ArrayList<>();
      Map<String, Integer> globalCategoryStats = new HashMap<>();
      int totalLoaded = 0;
      int totalSkipped = 0;

      for (Resource resource : resources) {
        String filename = Objects.requireNonNull(resource.getFilename());
        CsvLoadResult result = loadSingleFile(resource, filename, globalCategoryStats);
        results.add(result);
        totalLoaded += result.getLoadedRows();
        totalSkipped += result.getSkippedRows();
      }

      // Print summary
      log.info("=".repeat(80));
      log.info("CSV Loading Complete");
      log.info("=".repeat(80));

      for (CsvLoadResult result : results) {
        log.info(result.getSummary());

        if (logErrors && result.hasErrors()) {
          log.warn("Errors in {}:", result.getFileName());
          result.getErrors().forEach(error -> log.warn("  - {}", error));
        }

        if (logWarnings && result.hasWarnings()) {
          log.debug("Warnings in {}:", result.getFileName());
          result.getWarnings().forEach(warning -> log.debug("  - {}", warning));
        }
      }

      log.info("=".repeat(80));
      log.info("Global Statistics:");
      log.info("Total Questions Loaded: {} (Skipped: {})", totalLoaded, totalSkipped);
      log.info("Category Distribution:");
      globalCategoryStats.entrySet().stream()
              .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
              .forEach(entry -> log.info("  - {}: {}", entry.getKey(), entry.getValue()));
      log.info("=".repeat(80));

    } catch (Exception e) {
      log.error("Error loading CSV data", e);
    }
  }

  private CsvLoadResult loadSingleFile(Resource resource, String filename,
      Map<String, Integer> globalCategoryStats) {
    CsvLoadResult result = new CsvLoadResult(filename);
    String region = extractRegionFromFilename(filename);

    try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(resource.getInputStream()))) {
      CsvToBean<QuestionCsvRecord> csvToBean = new CsvToBeanBuilder<QuestionCsvRecord>(reader)
          .withType(QuestionCsvRecord.class)
          .withIgnoreLeadingWhiteSpace(true)
          .build();

      List<Question> questionsToSave = new ArrayList<>();
      int rowNumber = 1;
      for (QuestionCsvRecord csvRecord : csvToBean) {
        rowNumber++;
        result.incrementTotal();
        List<String> errors = validator.validateWithRegion(csvRecord, region, rowNumber);
        List<String> warnings = validator.validateEnumValues(csvRecord, rowNumber);

        if (!errors.isEmpty()) {
          result.addErrors(errors);
          result.incrementSkipped();
          continue;
        }

        if (!warnings.isEmpty()) {
          result.addWarnings(warnings);
        }

        Question question = convertToQuestion(csvRecord, region);
        questionsToSave.add(question);
        result.incrementLoaded();

        String normalizedCategory = trimAndNormalize(csvRecord.getCategory(), true);
        globalCategoryStats.merge(normalizedCategory, 1, Integer::sum);
      }

      if (!questionsToSave.isEmpty()) {
        questionRepository.saveAll(questionsToSave);
        log.info("Saved {} questions from {}", questionsToSave.size(), filename);
      }

    } catch (Exception e) {
      result.addError("Failed to load file: " + e.getMessage());
      log.error("Error loading CSV file {}", filename, e);
    }

    return result;
  }

  private Question convertToQuestion(QuestionCsvRecord csvRecord, String region) {
    Question question = new Question();
    question.setQuestionText(trimAndNormalize(csvRecord.getQuestion(), false));
    question.setAnswer(trimAndNormalize(csvRecord.getAnswer(), false));
    question.setCategory(trimAndNormalize(csvRecord.getCategory(), true));
    question.setType(trimAndNormalize(csvRecord.getQuestionType(), true));
    question.setLanguage(trimAndNormalize(csvRecord.getLanguage(), true));
    question.setRegion(trimAndNormalize(region, true));

    question.setOptions(parseChoices(csvRecord.getChoices()));

    question.setTerm(null);
    question.setTermMeaning(null);

    return question;
  }

  private String[] parseChoices(String choices) {
    if (choices == null || choices.trim().isEmpty() || choices.trim().equals("–")) {
      return new String[]{};
    }

    // Split by letter pattern (A. B. C. D.)
    String[] parts = choices.split("[A-Z]\\.\\s*");

    return Arrays.stream(parts)
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toArray(String[]::new);
  }

  private String trimAndNormalize(String value, boolean lowercase) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    if (lowercase) {
      return trimmed.toLowerCase();
    }
    return trimmed;
  }

  private String extractRegionFromFilename(String filename) {
    String region = filename.substring(0, filename.indexOf(".csv"));
    if (region.equals("CENTERAL")) {
      region = "CENTRAL";
    }
    return region;
  }
}

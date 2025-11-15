package com.saudiculture.services;

import com.saudiculture.dto.QuizSubmissionRequest;
import com.saudiculture.dto.QuizSubmissionResponse;
import com.saudiculture.models.Question;
import com.saudiculture.models.QuizAnswer;
import com.saudiculture.models.QuizSubmission;
import com.saudiculture.repositories.QuestionRepository;
import com.saudiculture.repositories.QuizSubmissionRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import static net.logstash.logback.argument.StructuredArguments.keyValue;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizSubmissionService {

  private final QuizSubmissionRepository quizSubmissionRepository;
  private final QuestionRepository questionRepository;
  private final List<String> FALSE_VARIANTS = new ArrayList<>(
      Arrays.asList("false", "خطأ", "حطا", "خاطئ", "خاطئة"));


  public QuizSubmissionResponse submitQuiz(QuizSubmissionRequest quizSubmissionRequest,
      String userId) {
    log.info("Submitting quiz", keyValue("userId", userId),
        keyValue("questionCount", quizSubmissionRequest.answers().size()));

    QuizSubmission quizSubmission = new QuizSubmission();
    quizSubmission.setUserId(userId);
    quizSubmission.setTotalQuestions(quizSubmissionRequest.answers().size());

    List<String> questionIds = quizSubmissionRequest.answers().stream()
        .map(QuizSubmissionRequest.AnswerInput::questionId).toList();

    Map<String, Question> questionsMap = new HashMap<>();
    questionRepository.findAllById(questionIds)
        .forEach(question -> questionsMap.put(question.getId(), question));

    List<QuizAnswer> userQuizAnswers = new ArrayList<>();
    int score = 0;
    for (QuizSubmissionRequest.AnswerInput answer : quizSubmissionRequest.answers()) {
      Question question = questionsMap.get(answer.questionId());

      if (question == null) {
        throw new RuntimeException("Question not found: " + answer.questionId());
      }

      boolean isCorrect = isCorrectAnswer(answer.userAnswer(), question.getAnswer(), question.getType(), question.getContentLanguage());
      if (isCorrect) {
        score++;
      }
      QuizAnswer userAnswer = new QuizAnswer(question.getId(), question.getQuestionText(),
          answer.userAnswer(), question.getAnswer(), isCorrect);

      userQuizAnswers.add(userAnswer);
    }

    quizSubmission.setAnswers(userQuizAnswers);
    quizSubmission.setScore(score);
    quizSubmission = quizSubmissionRepository.save(quizSubmission);

    log.info("Quiz submitted successfully", keyValue("userId", userId),
        keyValue("submissionId", quizSubmission.getId()), keyValue("score", score),
        keyValue("totalQuestions", quizSubmission.getTotalQuestions()));

    return convertToQuizSubmissionResponse(quizSubmission);
  }

  public List<QuizSubmissionResponse> getQuizSubmissions(String userId) {
    log.info("Fetching quiz submissions", keyValue("userId", userId));

    List<QuizSubmission> quizSubmissions = quizSubmissionRepository.findByUserIdOrderBySubmittedAtDesc(
        userId);

    log.info("Retrieved quiz submissions", keyValue("userId", userId),
        keyValue("count", quizSubmissions.size()));

    return quizSubmissions.stream().map(this::convertToQuizSubmissionResponse).toList();
  }

  private boolean isCorrectAnswer(String userAnswer, String correctAnswer, String questionType, String contentLanguage) {
    correctAnswer = correctAnswer.trim();
    if (contentLanguage.equalsIgnoreCase("arabic")) {
      if (userAnswer.equalsIgnoreCase("False")) {
        userAnswer = "خطأ";
      }
    }
    if (questionType.equalsIgnoreCase("open_ended")) {
      return correctAnswer.equalsIgnoreCase(userAnswer) || correctAnswer.contains(userAnswer);
    } else if (questionType.equalsIgnoreCase("multiple_choice") || questionType.equalsIgnoreCase(
        "single_choice")) {
      if (userAnswer == null || userAnswer.trim().isEmpty()) {
        return false;
      }
      return correctAnswer.equalsIgnoreCase(userAnswer) || correctAnswer.contains(userAnswer);
    } else if (questionType.equalsIgnoreCase("true_false")) {
      log.info("correctAnswer: {}", correctAnswer);
      log.info("userAnswer: {}", userAnswer);
      log.info("FALSE_VARIANTS: {}", FALSE_VARIANTS);

      boolean userInFalse = FALSE_VARIANTS.contains(userAnswer.toLowerCase());
      boolean correctInFalse = FALSE_VARIANTS.contains(correctAnswer.toLowerCase());
      boolean result = userInFalse == correctInFalse;

      log.info("userAnswer.toLowerCase(): {}", userAnswer.toLowerCase());
      log.info("correctAnswer.toLowerCase(): {}", correctAnswer.toLowerCase());
      log.info("userInFalse: {}", userInFalse);
      log.info("correctInFalse: {}", correctInFalse);
      log.info("result (userInFalse == correctInFalse): {}", result);

      return result;
    } else {
      throw new RuntimeException("Invalid question type: " + questionType);
    }
  }

  private QuizSubmissionResponse convertToQuizSubmissionResponse(QuizSubmission quizSubmission) {
    Double percentage =
        (double) quizSubmission.getScore() / quizSubmission.getTotalQuestions() * 100;
    return new QuizSubmissionResponse(quizSubmission.getId(), quizSubmission.getUserId(),
        quizSubmission.getAnswers(), quizSubmission.getScore(), quizSubmission.getTotalQuestions(),
        percentage, quizSubmission.getSubmittedAt());
  }

}

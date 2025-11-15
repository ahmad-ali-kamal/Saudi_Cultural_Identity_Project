package com.saudiculture.controllers;

import com.saudiculture.dto.InfoQuestionDTO;
import com.saudiculture.dto.QuizQuestionDTO;
import com.saudiculture.dto.QuizSubmissionRequest;
import com.saudiculture.dto.QuizSubmissionResponse;
import com.saudiculture.models.User;
import com.saudiculture.repositories.UserRepository;
import com.saudiculture.services.QuestionService;
import com.saudiculture.services.QuizSubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;

import static net.logstash.logback.argument.StructuredArguments.keyValue;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Quiz", description = "API endpoints for quiz questions and submissions")
public class QuestionController {

  private final QuestionService questionService;
  private final QuizSubmissionService quizSubmissionService;
  private final UserRepository userRepository;

  @Operation(
      summary = "Get informational questions",
      description = "Retrieve paginated informational questions about Saudi culture, filtered by language (defaults to Arabic) and optionally filtered by category, region, and search term. Search looks across question text, answer, term, and term meaning."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved questions"),
      @ApiResponse(responseCode = "400", description = "Invalid parameters")
  })
  @GetMapping("/info")
  public ResponseEntity<Page<InfoQuestionDTO>> getInfo(
      @Parameter(description = "Filter by language (defaults to Arabic)")
      @RequestParam(defaultValue = "Arabic") String language,
      @Parameter(description = "Filter by category (e.g., Traditional Food, Clothing, Festivals)")
      @RequestParam(required = false) String category,
      @Parameter(description = "Filter by region (e.g., WEST, EAST, NORTH, SOUTH, CENTRAL, GENERAL)")
      @RequestParam(required = false) String region,
      @Parameter(description = "Search term to find in question text, answer, term, or term meaning")
      @RequestParam(required = false) String search,
      @Parameter(description = "Page number (zero-indexed)")
      @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Number of items per page")
      @RequestParam(defaultValue = "20") int size
  ) {
    Page<InfoQuestionDTO> infoPage = questionService.getInfo(language, category, region, search, page, size);
    return ResponseEntity.ok(infoPage);
  }

  @Operation(
      summary = "Get random quiz questions",
      description = "Retrieve a randomized set of quiz questions, optionally filtered by category, region, and type"
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved quiz questions"),
      @ApiResponse(responseCode = "400", description = "Invalid parameters")
  })
  @GetMapping("/quiz")
  public ResponseEntity<List<QuizQuestionDTO>> getQuizzes(
      @Parameter(description = "Filter by category")
      @RequestParam(required = false) String category,
      @Parameter(description = "Filter by region")
      @RequestParam(required = false) String region,
      @Parameter(description = "Filter by question type (MCQ, True/False, or 'all' for mixed)")
      @RequestParam(required = false) String type,
      @Parameter(description = "Number of random questions to retrieve")
      @RequestParam(defaultValue = "20") int size
  ) {
    List<QuizQuestionDTO> quizList = questionService.getQuizzes(category, region, type, size);
    return ResponseEntity.ok(quizList);
  }

  @PostMapping("/quiz-submissions")
  @Operation(
      summary = "Submit quiz answers",
      description = "Submit completed quiz answers for scoring. Returns detailed results with score and correct answers.",
      security = @SecurityRequirement(name = "Bearer Authentication")
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "Quiz submitted successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid request"),
      @ApiResponse(responseCode = "401", description = "Unauthorized - valid JWT required"),
      @ApiResponse(responseCode = "404", description = "User not found - call /api/users/me first")
  })
  public ResponseEntity<QuizSubmissionResponse> submitQuiz(
      @RequestBody QuizSubmissionRequest quizSubmissionRequest,
      Authentication authentication) {
    String userId = getUserIdFromJwt(authentication);

    log.info("Quiz submission request received",
        keyValue("userId", userId),
        keyValue("questionCount", quizSubmissionRequest.answers().size()));

    QuizSubmissionResponse response = quizSubmissionService.submitQuiz(quizSubmissionRequest, userId);

    log.info("Quiz submitted successfully",
        keyValue("userId", userId),
        keyValue("submissionId", response.id()),
        keyValue("score", response.score()));

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/quiz-submissions")
  @Operation(
      summary = "Get my quiz submissions",
      description = "Retrieve all quiz submissions for the authenticated user, ordered by most recent first.",
      security = @SecurityRequirement(name = "Bearer Authentication")
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved submissions"),
      @ApiResponse(responseCode = "401", description = "Unauthorized - valid JWT required"),
      @ApiResponse(responseCode = "404", description = "User not found - call /api/users/me first")
  })
  public ResponseEntity<List<QuizSubmissionResponse>> getQuizSubmissions(
      Authentication authentication) {
    String userId = getUserIdFromJwt(authentication);

    log.info("Quiz submissions requested", keyValue("userId", userId));

    List<QuizSubmissionResponse> submissions = quizSubmissionService.getQuizSubmissions(userId);

    log.info("Quiz submissions retrieved",
        keyValue("userId", userId),
        keyValue("count", submissions.size()));

    return ResponseEntity.ok(submissions);
  }


  private String getUserIdFromJwt(Authentication authentication) {
    Jwt jwt = (Jwt) authentication.getPrincipal();
    String cognitoId = jwt.getSubject();

    User user = userRepository.findByCognitoId(cognitoId)
        .orElseThrow(() -> new IllegalStateException(
            "User not found. Please call /api/users/me to sync your profile first."));

    return user.getId();
  }
}
package com.saudiculture.controllers;

import com.saudiculture.dto.InfoQuestionDTO;
import com.saudiculture.dto.QuizQuestionDTO;
import com.saudiculture.services.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Questions", description = "API endpoints for Saudi cultural questions and quizzes")
public class QuestionController {

    private final QuestionService questionService;

    @Operation(
            summary = "Get informational questions",
            description = "Retrieve paginated informational questions about Saudi culture, optionally filtered by category and region"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved questions"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters")
    })
    @GetMapping("/info")
    public ResponseEntity<Page<InfoQuestionDTO>> getInfo(
            @Parameter(description = "Filter by category (e.g., Traditional Food, Clothing, Festivals)")
            @RequestParam(required = false) String category,
            @Parameter(description = "Filter by region (e.g., WEST, EAST, NORTH, SOUTH, CENTRAL, GENERAL)")
            @RequestParam(required = false) String region,
            @Parameter(description = "Page number (zero-indexed)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<InfoQuestionDTO> infoPage = questionService.getInfo(category, region, page, size);
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
    @GetMapping("/quizzes")
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
}
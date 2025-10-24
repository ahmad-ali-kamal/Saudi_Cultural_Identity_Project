package com.saudiculture.controllers;

import com.saudiculture.dto.InfoQuestionDTO;
import com.saudiculture.dto.QuizQuestionDTO;
import com.saudiculture.services.QuestionService;
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
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/info")
    public ResponseEntity<Page<InfoQuestionDTO>> getInfo(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<InfoQuestionDTO> infoPage = questionService.getInfo(category, region, page, size);
        return ResponseEntity.ok(infoPage);
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizQuestionDTO>> getQuizzes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "20") int size
    ) {
        List<QuizQuestionDTO> quizList = questionService.getQuizzes(category, region, type, size);
        return ResponseEntity.ok(quizList);
    }
}
package com.saudiculture.services;

import com.saudiculture.dto.InfoQuestionDTO;
import com.saudiculture.dto.QuizQuestionDTO;
import com.saudiculture.models.Question;
import com.saudiculture.repositories.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MongoTemplate mongoTemplate;

    public Page<InfoQuestionDTO> getInfo(String category, String region, int page, int size) {
        log.info("Fetching info questions - category: {}, region: {}, page: {}, size: {}", category, region, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Question> questionsPage;

        if (category != null && region != null) {
            questionsPage = questionRepository.findByCategoryAndRegion(category, region, pageable);
        } else if (category != null) {
            questionsPage = questionRepository.findByCategory(category, pageable);
        } else if (region != null) {
            questionsPage = questionRepository.findByRegion(region, pageable);
        } else {
            questionsPage = questionRepository.findAll(pageable);
        }

        List<InfoQuestionDTO> dtoList = questionsPage.getContent().stream()
                .map(this::convertToInfoDTO)
                .toList();

        log.info("Retrieved {} info questions", dtoList.size());
        return new PageImpl<>(dtoList, pageable, questionsPage.getTotalElements());
    }

    public List<QuizQuestionDTO> getQuizzes(String category, String region, String type, int size) {
        log.info("Fetching quiz questions - category: {}, region: {}, type: {}, size: {}", category, region, type, size);

        List<Criteria> criteriaList = new ArrayList<>();
        if (category != null) {
            criteriaList.add(Criteria.where("category").is(category));
        }
        if (region != null) {
            criteriaList.add(Criteria.where("region").is(region));
        }
        if (type != null && !type.equalsIgnoreCase("all")) {
            criteriaList.add(Criteria.where("type").is(type));
        }

        MatchOperation matchOperation = null;
        if (!criteriaList.isEmpty()) {
            matchOperation = Aggregation.match(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        List<AggregationOperation> aggregationOperations = new ArrayList<>();
        if (matchOperation != null) {
            aggregationOperations.add(matchOperation);
        }
        aggregationOperations.add(Aggregation.sample(size));

        Aggregation aggregation = Aggregation.newAggregation(aggregationOperations);

        AggregationResults<Question> results = mongoTemplate.aggregate(aggregation, "questions", Question.class);
        List<Question> randomQuestions = results.getMappedResults();

        log.info("Retrieved {} random quiz questions", randomQuestions.size());

        return randomQuestions.stream()
            .map(this::convertToQuizDTO)
            .toList();
    }

    private InfoQuestionDTO convertToInfoDTO(Question question) {
        InfoQuestionDTO dto = new InfoQuestionDTO();
        dto.setQuestionText(question.getQuestionText());
        dto.setAnswer(question.getAnswer());
        dto.setCategory(question.getCategory());
        dto.setLanguage(question.getLanguage());
        dto.setRegion(question.getRegion());
        return dto;
    }

    private QuizQuestionDTO convertToQuizDTO(Question question) {
        QuizQuestionDTO dto = new QuizQuestionDTO();
        dto.setQuestionText(question.getQuestionText());
        dto.setOptions(question.getOptions());
        dto.setAnswer(question.getAnswer());
        dto.setLanguage(question.getLanguage());
        dto.setRegion(question.getRegion());
        dto.setType(question.getType());
        dto.setCategory(question.getCategory());
        return dto;
    }
}
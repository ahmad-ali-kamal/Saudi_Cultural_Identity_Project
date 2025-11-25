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
import java.util.Base64;
import java.util.List;

import static net.logstash.logback.argument.StructuredArguments.keyValue;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MongoTemplate mongoTemplate;

    public Page<InfoQuestionDTO> getInfo(String language, String category, String region, String searchTerm, int page, int size) {
        log.info("Fetching info questions",
                keyValue("language", language),
                keyValue("category", category),
                keyValue("region", region),
                keyValue("searchTerm", searchTerm),
                keyValue("page", page),
                keyValue("size", size));
        Pageable pageable = PageRequest.of(page, size);
        Page<Question> questionsPage;

        // Determine which query method to use based on parameters
        // Language is always present (defaults to Arabic)
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            // Search is active - use text search queries with language filter
            if (category != null && region != null) {
                questionsPage = questionRepository.searchQuestionsByLanguageCategoryAndRegion(searchTerm, language, category, region, pageable);
            } else if (category != null) {
                questionsPage = questionRepository.searchQuestionsByLanguageAndCategory(searchTerm, language, category, pageable);
            } else if (region != null) {
                questionsPage = questionRepository.searchQuestionsByLanguageAndRegion(searchTerm, language, region, pageable);
            } else {
                questionsPage = questionRepository.searchQuestionsByLanguage(searchTerm, language, pageable);
            }
        } else {
            // No search - use filter queries with language
            if (category != null && region != null) {
                questionsPage = questionRepository.findByContentLanguageAndCategoryAndRegion(language, category, region, pageable);
            } else if (category != null) {
                questionsPage = questionRepository.findByContentLanguageAndCategory(language, category, pageable);
            } else if (region != null) {
                questionsPage = questionRepository.findByContentLanguageAndRegion(language, region, pageable);
            } else {
                questionsPage = questionRepository.findByContentLanguage(language, pageable);
            }
        }

        List<InfoQuestionDTO> dtoList = questionsPage.getContent().stream()
                .map(this::convertToInfoDTO)
                .toList();

        log.info("Retrieved info questions",
                keyValue("count", dtoList.size()),
                keyValue("totalElements", questionsPage.getTotalElements()));
        return new PageImpl<>(dtoList, pageable, questionsPage.getTotalElements());
    }

    public List<QuizQuestionDTO> getQuizzes(String category, String language, String region, String type, int size) {
        log.info("Fetching quiz questions",
                keyValue("category", category),
                keyValue("region", region),
                keyValue("type", type),
                keyValue("size", size));

        List<Criteria> criteriaList = new ArrayList<>();
        if (category != null) {
            criteriaList.add(Criteria.where("category").is(category));
        }
        if (language != null) {
          criteriaList.add(Criteria.where("content_language").is(language));
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

        log.info("Retrieved random quiz questions",
                keyValue("count", randomQuestions.size()));

        return randomQuestions.stream()
            .map(this::convertToQuizDTO)
            .toList();
    }

    private InfoQuestionDTO convertToInfoDTO(Question question) {
        InfoQuestionDTO dto = new InfoQuestionDTO();
        dto.setQuestionText(question.getQuestionText());
        dto.setAnswer(question.getAnswer());
        dto.setCategory(question.getCategory());
        dto.setLanguage(question.getContentLanguage());
        dto.setRegion(question.getRegion());

        // Convert image bytes to base64 if present
        if (question.getImageData() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(question.getImageData()));
            dto.setImageMimeType(question.getImageMimeType());
        }

        return dto;
    }

    private QuizQuestionDTO convertToQuizDTO(Question question) {
        QuizQuestionDTO dto = new QuizQuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptions(question.getOptions());
        dto.setAnswer(question.getAnswer());
        dto.setLanguage(question.getContentLanguage());
        dto.setRegion(question.getRegion());
        dto.setType(question.getType());
        dto.setCategory(question.getCategory());

        // Convert image bytes to base64 if present
        if (question.getImageData() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(question.getImageData()));
            dto.setImageMimeType(question.getImageMimeType());
        }

        return dto;
    }
}
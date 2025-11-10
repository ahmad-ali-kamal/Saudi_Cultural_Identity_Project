package com.saudiculture.repositories;

import com.saudiculture.models.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface QuestionRepository extends MongoRepository<Question, String> {

    // Legacy methods (kept for backward compatibility if needed)
    Page<Question> findByCategoryAndRegion(String category, String region, Pageable pageable);

    Page<Question> findByCategory(String category, Pageable pageable);

    Page<Question> findByRegion(String region, Pageable pageable);

    // New methods with language filter
    Page<Question> findByContentLanguage(String contentLanguage, Pageable pageable);

    Page<Question> findByContentLanguageAndCategory(String contentLanguage, String category, Pageable pageable);

    Page<Question> findByContentLanguageAndRegion(String contentLanguage, String region, Pageable pageable);

    Page<Question> findByContentLanguageAndCategoryAndRegion(String contentLanguage, String category, String region, Pageable pageable);

    // Regex-based search methods with language filter (works with Arabic and English)
    @Query("{ $and: [ " +
            "{ $or: [ " +
            "{ 'question_text': { $regex: ?0, $options: 'i' } }, " +
            "{ 'answer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term_meaning': { $regex: ?0, $options: 'i' } } " +
            "] }, " +
            "{ 'content_language': ?1 } " +
            "] }")
    Page<Question> searchQuestionsByLanguage(String searchTerm, String language, Pageable pageable);

    @Query("{ $and: [ " +
            "{ $or: [ " +
            "{ 'question_text': { $regex: ?0, $options: 'i' } }, " +
            "{ 'answer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term_meaning': { $regex: ?0, $options: 'i' } } " +
            "] }, " +
            "{ 'content_language': ?1 }, " +
            "{ 'category': ?2 } " +
            "] }")
    Page<Question> searchQuestionsByLanguageAndCategory(String searchTerm, String language, String category, Pageable pageable);

    @Query("{ $and: [ " +
            "{ $or: [ " +
            "{ 'question_text': { $regex: ?0, $options: 'i' } }, " +
            "{ 'answer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term_meaning': { $regex: ?0, $options: 'i' } } " +
            "] }, " +
            "{ 'content_language': ?1 }, " +
            "{ 'region': ?2 } " +
            "] }")
    Page<Question> searchQuestionsByLanguageAndRegion(String searchTerm, String language, String region, Pageable pageable);

    @Query("{ $and: [ " +
            "{ $or: [ " +
            "{ 'question_text': { $regex: ?0, $options: 'i' } }, " +
            "{ 'answer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term': { $regex: ?0, $options: 'i' } }, " +
            "{ 'term_meaning': { $regex: ?0, $options: 'i' } } " +
            "] }, " +
            "{ 'content_language': ?1 }, " +
            "{ 'category': ?2 }, " +
            "{ 'region': ?3 } " +
            "] }")
    Page<Question> searchQuestionsByLanguageCategoryAndRegion(String searchTerm, String language, String category, String region, Pageable pageable);
}

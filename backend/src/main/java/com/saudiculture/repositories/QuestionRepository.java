package com.saudiculture.repositories;

import com.saudiculture.models.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuestionRepository extends MongoRepository<Question, String> {

    Page<Question> findByCategoryAndRegion(String category, String region, Pageable pageable);

    Page<Question> findByCategory(String category, Pageable pageable);

    Page<Question> findByRegion(String region, Pageable pageable);
}

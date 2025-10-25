package com.saudiculture.data;

import com.saudiculture.models.Question;
import com.saudiculture.repositories.QuestionRepository;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
public class DataLoader {

    private final QuestionRepository questionRepository;
    private final ResourcePatternResolver resourcePatternResolver;

    public DataLoader(QuestionRepository questionRepository, ResourcePatternResolver resourcePatternResolver) {
        this.questionRepository = questionRepository;
        this.resourcePatternResolver = resourcePatternResolver;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void run() throws Exception {
        boolean dbEmpty = true; // Assume empty until proven otherwise
        int retries = 5;
        long sleepTime = 2000; // 2 seconds

        for (int i = 0; i < retries; i++) {
            try {
                if (questionRepository.count() > 0) {
                    dbEmpty = false;
                }
                break; // If count succeeds, break out of retry loop
            } catch (Exception e) {
                System.err.println("Attempt " + (i + 1) + " to check DB emptiness failed: " + e.getMessage());
                if (i < retries - 1) {
                    Thread.sleep(sleepTime);
                } else {
                    System.err.println("Failed to connect to MongoDB after multiple retries. Data loading will not proceed.");
                    return; // Exit if all retries fail
                }
            }
        }

        if (dbEmpty) {
            loadDataFromCsv();
        } else {
            System.out.println("Database already contains data. Skipping CSV loading.");
        }
    }

    private void loadDataFromCsv() {
        try {
            Resource[] resources = resourcePatternResolver.getResources("classpath:data/*.csv");

            for (Resource resource : resources) {
                String filename = Objects.requireNonNull(resource.getFilename());
                String region = filename.substring(0, filename.lastIndexOf(".")).toUpperCase();

                List<Question> questionsToSave = new ArrayList<>();

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
                    String line;
                    reader.readLine(); // Skip header row

                    while ((line = reader.readLine()) != null) {
                        // Split by comma, ignore commas in quotes
                        // The regex is: ,(?=(?:[^"]*"[^"]*")*[^"]*$)
                        // In Java string literal, backslashes need to be escaped.
                        String[] parts = line.split(",(?=(?:[^\"\"]*\"[^\"\"]*\\\")*[^\"\"]*$)", -1);

                        if (parts.length >= 8) { // Ensure enough columns
                            Question question = new Question();
                            question.setQuestionText(parts[0].replace("\"", ""));
                            
                            String choices = parts[1].replace("\"", "");
                            if (choices.equals("–")) {
                                question.setOptions(new String[]{});
                            } else {
                                // Assuming choices are semicolon-separated if not empty
                                question.setOptions(choices.split(";")); 
                            }

                            question.setAnswer(parts[2].replace("\"", ""));
                            question.setType(parts[3].replace("\"", "")); // Question Type
                            question.setCategory(parts[5].replace("\"", ""));
                            question.setLanguage(parts[6].replace("\"", ""));
                            question.setRegion(region);
                            // term and termMeaning are not in CSV, leave as null or set default
                            question.setTerm(null);
                            question.setTermMeaning(null);

                            questionsToSave.add(question);
                        }
                    }
                }
                questionRepository.saveAll(questionsToSave);
                System.out.println("Loaded " + questionsToSave.size() + " questions from " + filename);
            }
        } catch (Exception e) {
            System.err.println("Error loading data from CSV: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
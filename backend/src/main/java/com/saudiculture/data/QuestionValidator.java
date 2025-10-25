package com.saudiculture.data;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class QuestionValidator {

    private static final Set<String> VALID_REGIONS = Set.of(
            "WEST", "EAST", "NORTH", "SOUTH", "CENTRAL", "CENTERAL", "GENERAL"
    );

    private static final Set<String> VALID_QUESTION_TYPES = Set.of(
            "Open-ended", "MCQ", "True/False", "Multiple Choice"
    );

    public List<String> validate(QuestionCsvRecord csvRecord, int rowNumber) {
        List<String> errors = new ArrayList<>();

        // Validate required fields
        if (isBlank(csvRecord.getQuestion())) {
            errors.add("Row " + rowNumber + ": Question text is blank");
        }

        if (isBlank(csvRecord.getAnswer())) {
            errors.add("Row " + rowNumber + ": Answer is blank");
        }

        if (isBlank(csvRecord.getCategory())) {
            errors.add("Row " + rowNumber + ": Category is blank");
        }

        if (isBlank(csvRecord.getQuestionType())) {
            errors.add("Row " + rowNumber + ": Question Type is blank");
        }

        if (isBlank(csvRecord.getLanguage())) {
            errors.add("Row " + rowNumber + ": Language is blank");
        }

        return errors;
    }

    public List<String> validateWithRegion(QuestionCsvRecord csvRecord, String region, int rowNumber) {
        List<String> errors = validate(csvRecord, rowNumber);

        // Validate region
        if (!VALID_REGIONS.contains(region.toUpperCase())) {
            errors.add("Row " + rowNumber + ": Invalid region '" + region + "'");
        }

        return errors;
    }

    public List<String> validateEnumValues(QuestionCsvRecord csvRecord, int rowNumber) {
        List<String> warnings = new ArrayList<>();

        // Warn about unexpected question types
        if (!isBlank(csvRecord.getQuestionType()) &&
            !VALID_QUESTION_TYPES.contains(csvRecord.getQuestionType())) {
            warnings.add("Row " + rowNumber + ": Unexpected question type '" +
                        csvRecord.getQuestionType() + "'");
        }

        return warnings;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}

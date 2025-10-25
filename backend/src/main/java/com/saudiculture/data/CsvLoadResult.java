package com.saudiculture.data;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CsvLoadResult {
    private String fileName;
    private int totalRows;
    private int loadedRows;
    private int skippedRows;
    private List<String> errors;
    private List<String> warnings;

    public CsvLoadResult(String fileName) {
        this.fileName = fileName;
        this.totalRows = 0;
        this.loadedRows = 0;
        this.skippedRows = 0;
        this.errors = new ArrayList<>();
        this.warnings = new ArrayList<>();
    }

    public void incrementTotal() {
        this.totalRows++;
    }

    public void incrementLoaded() {
        this.loadedRows++;
    }

    public void incrementSkipped() {
        this.skippedRows++;
    }

    public void addError(String error) {
        this.errors.add(error);
    }

    public void addErrors(List<String> errors) {
        this.errors.addAll(errors);
    }

    public void addWarning(String warning) {
        this.warnings.add(warning);
    }

    public void addWarnings(List<String> warnings) {
        this.warnings.addAll(warnings);
    }

    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    public boolean hasWarnings() {
        return !warnings.isEmpty();
    }

    public String getSummary() {
        return String.format("%s: Loaded %d/%d rows (Skipped: %d, Errors: %d, Warnings: %d)",
                fileName, loadedRows, totalRows, skippedRows, errors.size(), warnings.size());
    }
}

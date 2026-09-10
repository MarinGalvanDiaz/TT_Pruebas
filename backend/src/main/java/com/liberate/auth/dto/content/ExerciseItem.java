package com.liberate.auth.dto.content;

import java.util.List;

public class ExerciseItem {
    private String id;
    private String title;
    private String subtitle;
    private String category;
    private int durationSeconds;
    private List<String> steps;

    public ExerciseItem() {}

    public ExerciseItem(String id, String title, String subtitle, String category, int durationSeconds, List<String> steps) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.category = category;
        this.durationSeconds = durationSeconds;
        this.steps = steps;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }
}


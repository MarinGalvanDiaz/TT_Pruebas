package com.liberate.auth.controller;

import com.liberate.auth.dto.content.ExerciseItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private static final List<ExerciseItem> EXERCISES = List.of(
            new ExerciseItem("ex-1", "Respiración 4-4-4 (Caja)", "Regula tu ritmo cardíaco y calma la ansiedad",
                    "Aire", 180, List.of("Inhala profundamente (4s)", "Mantén el aire (4s)", "Exhala lentamente (4s)", "Descansa (4s)")),
            new ExerciseItem("ex-2", "Respiración Profunda 4-7-8", "Ideal para conciliar el sueño y reducir estrés",
                    "Calma", 240, List.of("Inhala por la nariz (4s)", "Retén el aire (7s)", "Exhala completamente por la boca (8s)"))
    );

    @GetMapping
    public ResponseEntity<List<ExerciseItem>> getExercises() {
        return ResponseEntity.ok(EXERCISES);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseItem> getExerciseById(@PathVariable String id) {
        return EXERCISES.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}


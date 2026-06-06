package gym_management.controller;

import gym_management.dto.ProgressRequest;
import gym_management.entity.ProgressTracking;
import gym_management.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    // POST /api/progress/save → आजचा progress save करा
    @PostMapping("/save")
    public ResponseEntity<ProgressTracking> saveProgress(@RequestBody ProgressRequest request) {
        return ResponseEntity.ok(progressService.saveProgress(request));
    }

    // GET /api/progress/user/{userId} → सगळे records
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressTracking>> getAllProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getAllProgress(userId));
    }

    // GET /api/progress/today/{userId} → आजचा progress
    @GetMapping("/today/{userId}")
    public ResponseEntity<ProgressTracking> getTodayProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getTodayProgress(userId));
    }

    // GET /api/progress/weekly/{userId} → मागचे 7 दिवस
    @GetMapping("/weekly/{userId}")
    public ResponseEntity<List<ProgressTracking>> getWeeklyProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getWeeklyProgress(userId));
    }

    // GET /api/progress/monthly/{userId} → मागचे 30 दिवस
    @GetMapping("/monthly/{userId}")
    public ResponseEntity<List<ProgressTracking>> getMonthlyProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getMonthlyProgress(userId));
    }

    // GET /api/progress/workoutdays/{userId} → एकूण workout days
    @GetMapping("/workoutdays/{userId}")
    public ResponseEntity<Long> getWorkoutDays(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getTotalWorkoutDays(userId));
    }
}
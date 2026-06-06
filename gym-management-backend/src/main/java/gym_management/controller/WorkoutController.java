package gym_management.controller;

import gym_management.dto.WorkoutRequest;
import gym_management.entity.Exercise;
import gym_management.entity.WorkoutPlan;
import gym_management.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    // POST /api/workout/exercise/add  → exercise add करा
    @PostMapping("/exercise/add")
    public ResponseEntity<Exercise> addExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.ok(workoutService.addExercise(exercise));
    }

    // GET /api/workout/exercises  → सगळे exercises पाहा
    @GetMapping("/exercises")
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(workoutService.getAllExercises());
    }

    // GET /api/workout/exercises/{category}  → category नुसार exercises
    @GetMapping("/exercises/{category}")
    public ResponseEntity<List<Exercise>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(workoutService.getExercisesByCategory(category));
    }

    // POST /api/workout/plan/create  → workout plan बनवा
    @PostMapping("/plan/create")
    public ResponseEntity<WorkoutPlan> createPlan(@RequestBody WorkoutRequest request) {
        return ResponseEntity.ok(workoutService.createWorkoutPlan(request));
    }

    // GET /api/workout/user/{userId}  → user चे plans पाहा
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutPlan>> getUserPlans(@PathVariable Long userId) {
        return ResponseEntity.ok(workoutService.getUserWorkoutPlans(userId));
    }

    // GET /api/workout/goal/{fitnessGoal}  → goal नुसार plans पाहा
    @GetMapping("/goal/{fitnessGoal}")
    public ResponseEntity<List<WorkoutPlan>> getPlansByGoal(@PathVariable String fitnessGoal) {
        return ResponseEntity.ok(workoutService.getPlansByGoal(fitnessGoal));
    }

    // DELETE /api/workout/plan/delete/{planId}  → plan delete करा
    @DeleteMapping("/plan/delete/{planId}")
    public ResponseEntity<String> deletePlan(@PathVariable Long planId) {
        workoutService.deleteWorkoutPlan(planId);
        return ResponseEntity.ok("Workout plan deleted: " + planId);
    }
}
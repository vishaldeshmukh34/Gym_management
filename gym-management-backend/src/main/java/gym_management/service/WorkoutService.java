package gym_management.service;

import gym_management.dto.WorkoutRequest;
import gym_management.entity.Exercise;
import gym_management.entity.User;
import gym_management.entity.WorkoutPlan;
import gym_management.repository.ExerciseRepository;
import gym_management.repository.UserRepository;
import gym_management.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private UserRepository userRepository;

    // Exercise add करा (Admin / Trainer)
    public Exercise addExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    // सगळे exercises पाहा
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    // Category नुसार exercises पाहा (CHEST, LEGS etc.)
    public List<Exercise> getExercisesByCategory(String category) {
        return exerciseRepository.findByCategory(category);
    }

    // Workout Plan बनवा — exercises assign करा user ला
    public WorkoutPlan createWorkoutPlan(WorkoutRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

        List<Exercise> exercises = exerciseRepository.findAllById(request.getExerciseIds());

        WorkoutPlan plan = new WorkoutPlan();
        plan.setWorkoutName(request.getWorkoutName());
        plan.setFitnessGoal(request.getFitnessGoal());
        plan.setDifficulty(request.getDifficulty());
        plan.setUser(user);
        plan.setExercises(exercises);

        return workoutPlanRepository.save(plan);
    }

    // User चे सगळे workout plans पाहा
    public List<WorkoutPlan> getUserWorkoutPlans(Long userId) {
        return workoutPlanRepository.findByUserId(userId);
    }

    // Goal नुसार workout plans पाहा
    public List<WorkoutPlan> getPlansByGoal(String fitnessGoal) {
        return workoutPlanRepository.findByFitnessGoal(fitnessGoal);
    }

    // Workout Plan delete करा
    public void deleteWorkoutPlan(Long planId) {
        if (!workoutPlanRepository.existsById(planId)) {
            throw new RuntimeException("Workout plan not found: " + planId);
        }
        workoutPlanRepository.deleteById(planId);
    }
}
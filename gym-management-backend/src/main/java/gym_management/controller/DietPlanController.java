package gym_management.controller;

import gym_management.dto.DietPlanRequest;
import gym_management.entity.DietPlan;
import gym_management.entity.Meal;
import gym_management.service.DietPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diet")
public class DietPlanController {

    @Autowired
    private DietPlanService dietPlanService;

    // POST /api/diet/create → diet plan बनवा
    @PostMapping("/create")
    public ResponseEntity<DietPlan> createDietPlan(@RequestBody DietPlanRequest request) {
        return ResponseEntity.ok(dietPlanService.createDietPlan(request));
    }

    // GET /api/diet/user/{userId} → user चे plans पाहा
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DietPlan>> getUserPlans(@PathVariable Long userId) {
        return ResponseEntity.ok(dietPlanService.getUserDietPlans(userId));
    }

    // GET /api/diet/goal/{fitnessGoal} → goal नुसार plans
    @GetMapping("/goal/{fitnessGoal}")
    public ResponseEntity<List<DietPlan>> getPlansByGoal(@PathVariable String fitnessGoal) {
        return ResponseEntity.ok(dietPlanService.getPlansByGoal(fitnessGoal));
    }

    // GET /api/diet/meals/{dietPlanId} → plan चे meals पाहा
    @GetMapping("/meals/{dietPlanId}")
    public ResponseEntity<List<Meal>> getMeals(@PathVariable Long dietPlanId) {
        return ResponseEntity.ok(dietPlanService.getMealsByPlan(dietPlanId));
    }

    // PUT /api/diet/meal/complete/{mealId} → meal complete mark करा
    @PutMapping("/meal/complete/{mealId}")
    public ResponseEntity<Meal> completeMeal(@PathVariable Long mealId) {
        return ResponseEntity.ok(dietPlanService.markMealCompleted(mealId));
    }

    // DELETE /api/diet/delete/{planId} → plan delete करा
    @DeleteMapping("/delete/{planId}")
    public ResponseEntity<String> deletePlan(@PathVariable Long planId) {
        dietPlanService.deleteDietPlan(planId);
        return ResponseEntity.ok("Diet plan deleted: " + planId);
    }
}
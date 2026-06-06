package gym_management.service;

import gym_management.dto.DietPlanRequest;
import gym_management.dto.MealRequest;
import gym_management.entity.DietPlan;
import gym_management.entity.Meal;
import gym_management.entity.User;
import gym_management.repository.DietPlanRepository;
import gym_management.repository.MealRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DietPlanService {

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private UserRepository userRepository;

    // Diet Plan बनवा — meals सकट
    public DietPlan createDietPlan(DietPlanRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

        DietPlan plan = new DietPlan();
        plan.setPlanName(request.getPlanName());
        plan.setFitnessGoal(request.getFitnessGoal());
        plan.setTotalCalories(request.getTotalCalories());
        plan.setUser(user);

        DietPlan savedPlan = dietPlanRepository.save(plan);

        // Meals save करा
        if (request.getMeals() != null) {
            List<Meal> meals = new ArrayList<>();
            for (MealRequest mealReq : request.getMeals()) {
                Meal meal = new Meal();
                meal.setMealType(mealReq.getMealType());
                meal.setFoodName(mealReq.getFoodName());
                meal.setCalories(mealReq.getCalories());
                meal.setProtein(mealReq.getProtein());
                meal.setCarbs(mealReq.getCarbs());
                meal.setFats(mealReq.getFats());
                meal.setCompleted(false); // default not completed
                meal.setDietPlan(savedPlan);
                meals.add(meal);
            }
            mealRepository.saveAll(meals);
        }

        return savedPlan;
    }

    // User चे सगळे diet plans पाहा
    public List<DietPlan> getUserDietPlans(Long userId) {
        return dietPlanRepository.findByUserId(userId);
    }

    // Goal नुसार diet plans पाहा
    public List<DietPlan> getPlansByGoal(String fitnessGoal) {
        return dietPlanRepository.findByFitnessGoal(fitnessGoal);
    }

    // Meal complete mark करा — जेवण झालं
    public Meal markMealCompleted(Long mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new RuntimeException("Meal not found: " + mealId));
        meal.setCompleted(true);
        return mealRepository.save(meal);
    }

    // Diet Plan delete करा
    public void deleteDietPlan(Long planId) {
        if (!dietPlanRepository.existsById(planId)) {
            throw new RuntimeException("Diet plan not found: " + planId);
        }
        dietPlanRepository.deleteById(planId);
    }

    // Diet Plan चे सगळे meals पाहा
    public List<Meal> getMealsByPlan(Long dietPlanId) {
        return mealRepository.findByDietPlanId(dietPlanId);
    }
}
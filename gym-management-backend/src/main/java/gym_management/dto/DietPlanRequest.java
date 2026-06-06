package gym_management.dto;

import java.util.List;

public class DietPlanRequest {

    private String planName;
    private String fitnessGoal;
    private Integer totalCalories;
    private Long userId;
    private List<MealRequest> meals;

    public DietPlanRequest() {}

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public Integer getTotalCalories() { return totalCalories; }
    public void setTotalCalories(Integer totalCalories) { this.totalCalories = totalCalories; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<MealRequest> getMeals() { return meals; }
    public void setMeals(List<MealRequest> meals) { this.meals = meals; }
}
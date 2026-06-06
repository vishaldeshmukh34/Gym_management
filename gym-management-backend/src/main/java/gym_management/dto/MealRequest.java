package gym_management.dto;

public class MealRequest {

    private String mealType;   // BREAKFAST / LUNCH / DINNER / SNACK
    private String foodName;
    private Integer calories;
    private String protein;
    private String carbs;
    private String fats;

    public MealRequest() {}

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public String getProtein() { return protein; }
    public void setProtein(String protein) { this.protein = protein; }

    public String getCarbs() { return carbs; }
    public void setCarbs(String carbs) { this.carbs = carbs; }

    public String getFats() { return fats; }
    public void setFats(String fats) { this.fats = fats; }
}
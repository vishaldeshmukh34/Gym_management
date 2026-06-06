package gym_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mealType;   // BREAKFAST / LUNCH / DINNER / SNACK
    private String foodName;   // Oats + Banana / Rice + Chicken
    private Integer calories;
    private String protein;    // e.g. "30g"
    private String carbs;      // e.g. "50g"
    private String fats;       // e.g. "10g"
    private Boolean completed; // meal khalli ka nahi

    @ManyToOne
    @JoinColumn(name = "diet_plan_id")
    private DietPlan dietPlan;

    public Meal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public DietPlan getDietPlan() { return dietPlan; }
    public void setDietPlan(DietPlan dietPlan) { this.dietPlan = dietPlan; }
}
package gym_management.dto;

import java.time.LocalDate;

public class ProgressRequest {

    private Long userId;
    private LocalDate date;        // ← date manually पाठवा
    private Double weight;
    private Integer caloriesBurned;
    private Integer waterIntake;
    private Boolean workoutDone;
    private Double chest;
    private Double waist;
    private Double arms;
    private Double thighs;

    public ProgressRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public Integer getWaterIntake() { return waterIntake; }
    public void setWaterIntake(Integer waterIntake) { this.waterIntake = waterIntake; }

    public Boolean getWorkoutDone() { return workoutDone; }
    public void setWorkoutDone(Boolean workoutDone) { this.workoutDone = workoutDone; }

    public Double getChest() { return chest; }
    public void setChest(Double chest) { this.chest = chest; }

    public Double getWaist() { return waist; }
    public void setWaist(Double waist) { this.waist = waist; }

    public Double getArms() { return arms; }
    public void setArms(Double arms) { this.arms = arms; }

    public Double getThighs() { return thighs; }
    public void setThighs(Double thighs) { this.thighs = thighs; }
}
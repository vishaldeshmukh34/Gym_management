package gym_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "progress_tracking")
public class ProgressTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;          // कोणत्या दिवशीचा record
    private Double weight;           // kg मध्ये
    private Integer caloriesBurned;  // workout मध्ये किती calories
    private Integer waterIntake;     // ml मध्ये — 1 glass = 250ml
    private Boolean workoutDone;     // त्या दिवशी workout केला का

    // Body Measurements
    private Double chest;   // cm
    private Double waist;   // cm
    private Double arms;    // cm
    private Double thighs;  // cm

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public ProgressTracking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
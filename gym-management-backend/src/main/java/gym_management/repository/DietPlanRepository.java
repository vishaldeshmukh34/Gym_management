package gym_management.repository;

import gym_management.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByUserId(Long userId);
    List<DietPlan> findByFitnessGoal(String fitnessGoal);
}
package gym_management.repository;

import gym_management.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByDietPlanId(Long dietPlanId);
}
package gym_management.repository;

import gym_management.entity.ProgressTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<ProgressTracking, Long> {

    // User चे सगळे records
    List<ProgressTracking> findByUserId(Long userId);

    // आजचा record आहे का check करा
    Optional<ProgressTracking> findByUserIdAndDate(Long userId, LocalDate date);

    // Date range नुसार records — weekly / monthly
    List<ProgressTracking> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    // किती दिवस workout केला count करा
    @Query("SELECT COUNT(p) FROM ProgressTracking p WHERE p.user.id = :userId AND p.workoutDone = true")
    Long countWorkoutDays(@Param("userId") Long userId);
}
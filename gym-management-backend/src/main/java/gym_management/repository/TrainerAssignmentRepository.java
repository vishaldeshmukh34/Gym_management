package gym_management.repository;

import gym_management.entity.TrainerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainerAssignmentRepository extends JpaRepository<TrainerAssignment, Long> {
    List<TrainerAssignment> findByUserId(Long userId);
    List<TrainerAssignment> findByTrainerId(Long trainerId);
    Optional<TrainerAssignment> findByUserIdAndStatus(Long userId, String status);
}
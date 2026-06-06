package gym_management.repository;

import gym_management.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    List<Trainer> findBySpecialization(String specialization);
    List<Trainer> findByStatus(String status);
    Optional<Trainer> findByUserId(Long userId);
}
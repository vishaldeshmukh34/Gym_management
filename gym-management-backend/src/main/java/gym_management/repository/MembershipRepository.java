package gym_management.repository;

import gym_management.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByUserId(Long userId);
    Optional<Membership> findByUserIdAndStatus(Long userId, String status);
    List<Membership> findByStatus(String status);
}
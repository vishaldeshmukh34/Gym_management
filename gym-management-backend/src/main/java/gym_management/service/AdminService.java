package gym_management.service;

import gym_management.entity.Membership;
import gym_management.entity.Trainer;
import gym_management.entity.User;
import gym_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private TrainerAssignmentRepository trainerAssignmentRepository;

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    // ─── USER MANAGEMENT ────────────────────────────────────

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // User delete — पहिले linked data delete करा
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found: " + userId);
        }

        // 1. Progress delete करा
        List<gym_management.entity.ProgressTracking> progress = progressRepository.findByUserId(userId);
        progressRepository.deleteAll(progress);

        // 2. Membership delete करा
        List<Membership> memberships = membershipRepository.findByUserId(userId);
        membershipRepository.deleteAll(memberships);

        // 3. Trainer assignment delete करा
        List<gym_management.entity.TrainerAssignment> assignments = trainerAssignmentRepository.findByUserId(userId);
        trainerAssignmentRepository.deleteAll(assignments);

        // 4. Diet plans delete करा
        List<gym_management.entity.DietPlan> dietPlans = dietPlanRepository.findByUserId(userId);
        dietPlanRepository.deleteAll(dietPlans);

        // 5. Workout plans delete करा
        List<gym_management.entity.WorkoutPlan> workoutPlans = workoutPlanRepository.findByUserId(userId);
        workoutPlanRepository.deleteAll(workoutPlans);

        // 6. Profile delete करा
        userProfileRepository.findByUserId(userId)
                .ifPresent(userProfileRepository::delete);

        // 7. शेवटी user delete करा
        userRepository.deleteById(userId);
    }

    // ─── TRAINER MANAGEMENT ─────────────────────────────────

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public List<Trainer> getActiveTrainers() {
        return trainerRepository.findByStatus("ACTIVE");
    }

    @Transactional
    public void deleteTrainer(Long trainerId) {
        if (!trainerRepository.existsById(trainerId)) {
            throw new RuntimeException("Trainer not found: " + trainerId);
        }
        // Assignments delete करा आधी
        List<gym_management.entity.TrainerAssignment> assignments = trainerAssignmentRepository.findByTrainerId(trainerId);
        trainerAssignmentRepository.deleteAll(assignments);

        trainerRepository.deleteById(trainerId);
    }

    // ─── MEMBERSHIP MANAGEMENT ──────────────────────────────

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public List<Membership> getActiveMemberships() {
        return membershipRepository.findByStatus("ACTIVE");
    }

    // ─── REVENUE ANALYTICS ──────────────────────────────────

    public Map<String, Object> getRevenueReport() {
        List<Membership> allMemberships = membershipRepository.findAll();

        double totalRevenue = allMemberships.stream()
                .mapToDouble(m -> m.getAmount() != null ? m.getAmount() : 0)
                .sum();

        long monthlyCount = allMemberships.stream()
                .filter(m -> "MONTHLY".equals(m.getPlanName())).count();
        long quarterlyCount = allMemberships.stream()
                .filter(m -> "QUARTERLY".equals(m.getPlanName())).count();
        long yearlyCount = allMemberships.stream()
                .filter(m -> "YEARLY".equals(m.getPlanName())).count();
        long activeCount = allMemberships.stream()
                .filter(m -> "ACTIVE".equals(m.getStatus())).count();
        long expiredCount = allMemberships.stream()
                .filter(m -> "EXPIRED".equals(m.getStatus())).count();

        Map<String, Object> report = new HashMap<>();
        report.put("totalRevenue", "₹" + totalRevenue);
        report.put("totalMemberships", allMemberships.size());
        report.put("activeMemberships", activeCount);
        report.put("expiredMemberships", expiredCount);
        report.put("monthlyPlans", monthlyCount);
        report.put("quarterlyPlans", quarterlyCount);
        report.put("yearlyPlans", yearlyCount);

        return report;
    }

    // Dashboard summary
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("totalTrainers", trainerRepository.count());
        summary.put("totalMemberships", membershipRepository.count());
        summary.put("activeMemberships", membershipRepository.findByStatus("ACTIVE").size());
        summary.put("activeTrainers", trainerRepository.findByStatus("ACTIVE").size());
        return summary;
    }
}
package gym_management.service;

import gym_management.dto.ProgressRequest;
import gym_management.entity.ProgressTracking;
import gym_management.entity.User;
import gym_management.repository.ProgressRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    // Progress save करा — date manually येते
    public ProgressTracking saveProgress(ProgressRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

        // date null असेल तर आजची date वापरा
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();

        // त्या date चा record आधीच आहे का — असेल तर update करा
        ProgressTracking progress = progressRepository
                .findByUserIdAndDate(request.getUserId(), date)
                .orElse(new ProgressTracking());

        progress.setUser(user);
        progress.setDate(date);
        progress.setWeight(request.getWeight());
        progress.setCaloriesBurned(request.getCaloriesBurned());
        progress.setWaterIntake(request.getWaterIntake());
        progress.setWorkoutDone(request.getWorkoutDone());
        progress.setChest(request.getChest());
        progress.setWaist(request.getWaist());
        progress.setArms(request.getArms());
        progress.setThighs(request.getThighs());

        return progressRepository.save(progress);
    }

    // सगळे records
    public List<ProgressTracking> getAllProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    // आजचा progress
    public ProgressTracking getTodayProgress(Long userId) {
        return progressRepository.findByUserIdAndDate(userId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No progress found for today"));
    }

    // Weekly — मागचे 7 दिवस
    public List<ProgressTracking> getWeeklyProgress(Long userId) {
        LocalDate today = LocalDate.now();
        return progressRepository.findByUserIdAndDateBetween(userId, today.minusDays(7), today);
    }

    // Monthly — मागचे 30 दिवस
    public List<ProgressTracking> getMonthlyProgress(Long userId) {
        LocalDate today = LocalDate.now();
        return progressRepository.findByUserIdAndDateBetween(userId, today.minusDays(30), today);
    }

    // Total workout days
    public Long getTotalWorkoutDays(Long userId) {
        return progressRepository.countWorkoutDays(userId);
    }
}
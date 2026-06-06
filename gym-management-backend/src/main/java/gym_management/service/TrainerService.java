package gym_management.service;

import gym_management.dto.TrainerRequest;
import gym_management.entity.Trainer;
import gym_management.entity.TrainerAssignment;
import gym_management.entity.User;
import gym_management.repository.TrainerAssignmentRepository;
import gym_management.repository.TrainerRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private TrainerAssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    // Trainer add करा (Admin)
    public Trainer addTrainer(TrainerRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

        Trainer trainer = new Trainer();
        trainer.setUser(user);
        trainer.setTrainerName(request.getTrainerName());
        trainer.setEmail(request.getEmail());
        trainer.setPhone(request.getPhone());
        trainer.setSpecialization(request.getSpecialization());
        trainer.setExperience(request.getExperience());
        trainer.setStatus("ACTIVE");

        return trainerRepository.save(trainer);
    }

    // सगळे trainers पाहा
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    // Specialization नुसार trainers पाहा
    public List<Trainer> getTrainersBySpecialization(String specialization) {
        return trainerRepository.findBySpecialization(specialization);
    }

    // Trainer ला user assign करा
    public TrainerAssignment assignTrainerToUser(Long trainerId, Long userId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found: " + trainerId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // आधीच trainer assigned आहे का check
        assignmentRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .ifPresent(a -> {
                    throw new RuntimeException("User already has an active trainer assigned");
                });

        TrainerAssignment assignment = new TrainerAssignment();
        assignment.setTrainer(trainer);
        assignment.setUser(user);
        assignment.setAssignedDate(LocalDate.now());
        assignment.setStatus("ACTIVE");

        return assignmentRepository.save(assignment);
    }

    // User चा trainer पाहा
    public TrainerAssignment getUserTrainer(Long userId) {
        return assignmentRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow(() -> new RuntimeException("No trainer assigned to user: " + userId));
    }

    // Trainer चे सगळे users पाहा
    public List<TrainerAssignment> getTrainerUsers(Long trainerId) {
        return assignmentRepository.findByTrainerId(trainerId);
    }

    // Trainer inactive करा (Admin)
    public Trainer deactivateTrainer(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found: " + trainerId));
        trainer.setStatus("INACTIVE");
        return trainerRepository.save(trainer);
    }

    // Assignment complete करा
    public TrainerAssignment completeAssignment(Long assignmentId) {
        TrainerAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found: " + assignmentId));
        assignment.setStatus("COMPLETED");
        return assignmentRepository.save(assignment);
    }
}
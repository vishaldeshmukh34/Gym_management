package gym_management.controller;

import gym_management.dto.TrainerRequest;
import gym_management.entity.Trainer;
import gym_management.entity.TrainerAssignment;
import gym_management.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    // POST /api/trainer/add → trainer add करा (Admin)
    @PostMapping("/add")
    public ResponseEntity<Trainer> addTrainer(@RequestBody TrainerRequest request) {
        return ResponseEntity.ok(trainerService.addTrainer(request));
    }

    // GET /api/trainer/all → सगळे trainers पाहा
    @GetMapping("/all")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        return ResponseEntity.ok(trainerService.getAllTrainers());
    }

    // GET /api/trainer/specialization/{spec} → specialization नुसार
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Trainer>> getBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(trainerService.getTrainersBySpecialization(specialization));
    }

    // POST /api/trainer/assign/{trainerId}/{userId} → user ला trainer assign करा
    @PostMapping("/assign/{trainerId}/{userId}")
    public ResponseEntity<TrainerAssignment> assignTrainer(
            @PathVariable Long trainerId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(trainerService.assignTrainerToUser(trainerId, userId));
    }

    // GET /api/trainer/user/{userId} → user चा trainer पाहा
    @GetMapping("/user/{userId}")
    public ResponseEntity<TrainerAssignment> getUserTrainer(@PathVariable Long userId) {
        return ResponseEntity.ok(trainerService.getUserTrainer(userId));
    }

    // GET /api/trainer/clients/{trainerId} → trainer चे सगळे users
    @GetMapping("/clients/{trainerId}")
    public ResponseEntity<List<TrainerAssignment>> getTrainerClients(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainerService.getTrainerUsers(trainerId));
    }

    // PUT /api/trainer/deactivate/{trainerId} → trainer inactive करा
    @PutMapping("/deactivate/{trainerId}")
    public ResponseEntity<Trainer> deactivateTrainer(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainerService.deactivateTrainer(trainerId));
    }

    // PUT /api/trainer/complete/{assignmentId} → assignment complete करा
    @PutMapping("/complete/{assignmentId}")
    public ResponseEntity<TrainerAssignment> completeAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(trainerService.completeAssignment(assignmentId));
    }
}

package gym_management.controller;

import gym_management.entity.Membership;
import gym_management.entity.Trainer;
import gym_management.entity.User;
import gym_management.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ─── DASHBOARD ───────────────────────────────────────────

    // GET /api/admin/dashboard → सगळ्याचा summary
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    // ─── USER MANAGEMENT ─────────────────────────────────────

    // GET /api/admin/users → सगळे users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // DELETE /api/admin/users/delete/{userId} → user delete
    @DeleteMapping("/users/delete/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted: " + userId);
    }

    // ─── TRAINER MANAGEMENT ──────────────────────────────────

    // GET /api/admin/trainers → सगळे trainers
    @GetMapping("/trainers")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        return ResponseEntity.ok(adminService.getAllTrainers());
    }

    // GET /api/admin/trainers/active → active trainers
    @GetMapping("/trainers/active")
    public ResponseEntity<List<Trainer>> getActiveTrainers() {
        return ResponseEntity.ok(adminService.getActiveTrainers());
    }

    // DELETE /api/admin/trainers/delete/{trainerId} → trainer delete
    @DeleteMapping("/trainers/delete/{trainerId}")
    public ResponseEntity<String> deleteTrainer(@PathVariable Long trainerId) {
        adminService.deleteTrainer(trainerId);
        return ResponseEntity.ok("Trainer deleted: " + trainerId);
    }

    // ─── MEMBERSHIP MANAGEMENT ───────────────────────────────

    // GET /api/admin/memberships → सगळ्या memberships
    @GetMapping("/memberships")
    public ResponseEntity<List<Membership>> getAllMemberships() {
        return ResponseEntity.ok(adminService.getAllMemberships());
    }

    // GET /api/admin/memberships/active → active memberships
    @GetMapping("/memberships/active")
    public ResponseEntity<List<Membership>> getActiveMemberships() {
        return ResponseEntity.ok(adminService.getActiveMemberships());
    }

    // ─── REVENUE REPORT ──────────────────────────────────────

    // GET /api/admin/revenue → revenue report
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenue() {
        return ResponseEntity.ok(adminService.getRevenueReport());
    }
}
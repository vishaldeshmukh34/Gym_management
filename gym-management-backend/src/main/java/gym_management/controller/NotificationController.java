package gym_management.controller;

import gym_management.entity.Notification;
import gym_management.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // POST /api/notifications/workout/{userId} → Workout reminder
    @PostMapping("/workout/{userId}")
    public ResponseEntity<Notification> workoutReminder(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.sendWorkoutReminder(userId));
    }

    // POST /api/notifications/water/{userId} → Water reminder
    @PostMapping("/water/{userId}")
    public ResponseEntity<Notification> waterReminder(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.sendWaterReminder(userId));
    }

    // POST /api/notifications/diet/{userId} → Diet reminder
    @PostMapping("/diet/{userId}")
    public ResponseEntity<Notification> dietReminder(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.sendDietReminder(userId));
    }

    // POST /api/notifications/membership/{userId} → Membership expiry reminder
    @PostMapping("/membership/{userId}")
    public ResponseEntity<Notification> membershipReminder(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.sendMembershipExpiryReminder(userId));
    }

    // GET /api/notifications/user/{userId} → सगळ्या notifications
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    // GET /api/notifications/unread/{userId} → फक्त UNREAD
    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<Notification>> getUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    // PUT /api/notifications/read/{notificationId} → READ mark करा
    @PutMapping("/read/{notificationId}")
    public ResponseEntity<Notification> markRead(@PathVariable Long notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    // PUT /api/notifications/readall/{userId} → सगळ्या READ mark करा
    @PutMapping("/readall/{userId}")
    public ResponseEntity<String> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    // DELETE /api/notifications/delete/{notificationId} → delete
    @DeleteMapping("/delete/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Notification deleted: " + notificationId);
    }
}
package gym_management.service;

import gym_management.entity.Membership;
import gym_management.entity.Notification;
import gym_management.entity.User;
import gym_management.repository.MembershipRepository;
import gym_management.repository.NotificationRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    // Notification बनवायचा helper method
    private Notification createNotification(User user, String type, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    // Workout Reminder पाठवा
    public Notification sendWorkoutReminder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return createNotification(user, "WORKOUT_REMINDER",
                "Hey " + user.getName() + "! आजचा workout केलास का? 💪 Gym ला ये!");
    }

    // Water Reminder पाठवा
    public Notification sendWaterReminder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return createNotification(user, "WATER_REMINDER",
                "Hey " + user.getName() + "! पाणी प्यायलास का? 💧 आत्ता 1 glass पी!");
    }

    // Diet Reminder पाठवा
    public Notification sendDietReminder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return createNotification(user, "DIET_REMINDER",
                "Hey " + user.getName() + "! जेवणाची वेळ झाली! 🥗 Diet plan follow कर!");
    }

    // Membership Expiry check करून reminder पाठवा
    public Notification sendMembershipExpiryReminder(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Membership membership = membershipRepository
                .findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow(() -> new RuntimeException("No active membership for user: " + userId));

        long daysLeft = LocalDate.now().until(membership.getExpiryDate()).getDays();

        return createNotification(user, "MEMBERSHIP_EXPIRY",
                "Hey " + user.getName() + "! तुमची membership " + daysLeft + " दिवसांनी expire होणार आहे! 🏋️ Renew करा!");
    }

    // User च्या सगळ्या notifications पाहा
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // फक्त UNREAD notifications पाहा
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndStatus(userId, "UNREAD");
    }

    // Notification READ mark करा
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setStatus("READ");
        return notificationRepository.save(notification);
    }

    // सगळ्या notifications READ mark करा
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndStatus(userId, "UNREAD");
        unread.forEach(n -> n.setStatus("READ"));
        notificationRepository.saveAll(unread);
    }

    // Notification delete करा
    public void deleteNotification(Long notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new RuntimeException("Notification not found: " + notificationId);
        }
        notificationRepository.deleteById(notificationId);
    }
}
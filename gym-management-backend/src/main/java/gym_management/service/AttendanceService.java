package gym_management.service;

import gym_management.entity.Attendance;
import gym_management.entity.User;
import gym_management.repository.AttendanceRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    // User साठी QR Code generate करा
    public String generateQRCode(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Unique QR code बनवा — userId + UUID
        String qrCode = "GYM-" + userId + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return qrCode;
    }

    // QR Scan करून Check-In करा
    public Attendance checkIn(String qrCode) {
        // QR code मधून userId काढा
        String[] parts = qrCode.split("-");
        if (parts.length < 2) {
            throw new RuntimeException("Invalid QR code: " + qrCode);
        }

        Long userId = Long.parseLong(parts[1]);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // आजचा attendance आधीच आहे का check करा
        attendanceRepository.findByUserIdAndDate(userId, LocalDate.now())
                .ifPresent(a -> {
                    throw new RuntimeException("Already checked in today at: " + a.getCheckInTime());
                });

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(LocalDate.now());
        attendance.setCheckInTime(LocalTime.now());
        attendance.setQrCode(qrCode);
        attendance.setStatus("PRESENT");

        return attendanceRepository.save(attendance);
    }

    // Check-Out करा
    public Attendance checkOut(String qrCode) {
        String[] parts = qrCode.split("-");
        Long userId = Long.parseLong(parts[1]);

        Attendance attendance = attendanceRepository
                .findByUserIdAndDate(userId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new RuntimeException("Already checked out at: " + attendance.getCheckOutTime());
        }

        attendance.setCheckOutTime(LocalTime.now());
        return attendanceRepository.save(attendance);
    }

    // User चे सगळे attendance records
    public List<Attendance> getUserAttendance(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    // आजचा attendance पाहा
    public Attendance getTodayAttendance(Long userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No attendance found for today"));
    }

    // Weekly attendance — मागचे 7 दिवस
    public List<Attendance> getWeeklyAttendance(Long userId) {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByUserIdAndDateBetween(userId, today.minusDays(7), today);
    }

    // Monthly attendance — मागचे 30 दिवस
    public List<Attendance> getMonthlyAttendance(Long userId) {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByUserIdAndDateBetween(userId, today.minusDays(30), today);
    }

    // एकूण present days count
    public Long getTotalPresentDays(Long userId) {
        return attendanceRepository.countPresentDays(userId);
    }

    // Admin — आजचे सगळे attendance पाहा
    public List<Attendance> getTodayAllAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }
}
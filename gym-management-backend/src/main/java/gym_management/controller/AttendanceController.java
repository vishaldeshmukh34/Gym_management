package gym_management.controller;

import gym_management.entity.Attendance;
import gym_management.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // GET /api/attendance/qr/{userId} → QR Code generate करा
    @GetMapping("/qr/{userId}")
    public ResponseEntity<String> generateQR(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.generateQRCode(userId));
    }

    // POST /api/attendance/checkin/{qrCode} → QR scan करून check-in
    @PostMapping("/checkin/{qrCode}")
    public ResponseEntity<Attendance> checkIn(@PathVariable String qrCode) {
        return ResponseEntity.ok(attendanceService.checkIn(qrCode));
    }

    // POST /api/attendance/checkout/{qrCode} → check-out
    @PostMapping("/checkout/{qrCode}")
    public ResponseEntity<Attendance> checkOut(@PathVariable String qrCode) {
        return ResponseEntity.ok(attendanceService.checkOut(qrCode));
    }

    // GET /api/attendance/today/{userId} → आजचा attendance
    @GetMapping("/today/{userId}")
    public ResponseEntity<Attendance> getTodayAttendance(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getTodayAttendance(userId));
    }

    // GET /api/attendance/user/{userId} → सगळे records
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getUserAttendance(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getUserAttendance(userId));
    }

    // GET /api/attendance/weekly/{userId} → मागचे 7 दिवस
    @GetMapping("/weekly/{userId}")
    public ResponseEntity<List<Attendance>> getWeekly(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getWeeklyAttendance(userId));
    }

    // GET /api/attendance/monthly/{userId} → मागचे 30 दिवस
    @GetMapping("/monthly/{userId}")
    public ResponseEntity<List<Attendance>> getMonthly(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getMonthlyAttendance(userId));
    }

    // GET /api/attendance/total/{userId} → एकूण present days
    @GetMapping("/total/{userId}")
    public ResponseEntity<Long> getTotalDays(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getTotalPresentDays(userId));
    }

    // GET /api/attendance/admin/today → Admin — आजचे सगळे attendance
    @GetMapping("/admin/today")
    public ResponseEntity<List<Attendance>> getTodayAll() {
        return ResponseEntity.ok(attendanceService.getTodayAllAttendance());
    }
}
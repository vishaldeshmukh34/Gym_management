package gym_management.repository;

import gym_management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // User चे सगळे attendance records
    List<Attendance> findByUserId(Long userId);

    // आजचा attendance आहे का check करा
    Optional<Attendance> findByUserIdAndDate(Long userId, LocalDate date);

    // Date range नुसार attendance
    List<Attendance> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);

    // QR code ने user शोधा
    Optional<Attendance> findByQrCodeAndDate(String qrCode, LocalDate date);

    // एकूण किती दिवस आला count करा
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user.id = :userId AND a.status = 'PRESENT'")
    Long countPresentDays(@Param("userId") Long userId);

    // आजचे सगळे attendance (Admin)
    List<Attendance> findByDate(LocalDate date);
}
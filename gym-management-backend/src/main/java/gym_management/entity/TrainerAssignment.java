package gym_management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "trainer_assignments")
public class TrainerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate assignedDate;
    private String status;  // ACTIVE / COMPLETED

    public TrainerAssignment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trainer getTrainer() { return trainer; }
    public void setTrainer(Trainer trainer) { this.trainer = trainer; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
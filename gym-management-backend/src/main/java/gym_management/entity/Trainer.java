package gym_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainerName;
    private String email;
    private String phone;
    private String specialization;  // WEIGHT_LOSS / MUSCLE_BUILDING / YOGA / CARDIO
    private String experience;      // e.g. "5 years"
    private String status;          // ACTIVE / INACTIVE

    @OneToOne
    @JoinColumn(name = "user_id")  // trainer हा user पण आहे
    private User user;

    public Trainer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
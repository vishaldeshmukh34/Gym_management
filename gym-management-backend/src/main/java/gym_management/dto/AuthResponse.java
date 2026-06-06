package gym_management.dto;

import gym_management.enums.Role;

public class AuthResponse {

    private Long id;       // ← id add केला
    private String message;
    private String email;
    private Role role;

    public AuthResponse(Long id, String message, String email, Role role) {
        this.id = id;
        this.message = message;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
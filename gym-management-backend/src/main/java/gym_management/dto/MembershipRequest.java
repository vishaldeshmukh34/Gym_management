package gym_management.dto;

public class MembershipRequest {

    private Long userId;
    private String planName; // MONTHLY / QUARTERLY / YEARLY

    public MembershipRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
}
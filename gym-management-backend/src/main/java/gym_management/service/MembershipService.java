package gym_management.service;

import gym_management.dto.MembershipRequest;
import gym_management.entity.Membership;
import gym_management.entity.User;
import gym_management.repository.MembershipRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private UserRepository userRepository;

    // Membership buy करा
    public Membership buyMembership(MembershipRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));

        // आधी active membership आहे का check करा
        membershipRepository.findByUserIdAndStatus(request.getUserId(), "ACTIVE")
                .ifPresent(m -> {
                    throw new RuntimeException("User already has an ACTIVE membership expiring on: " + m.getExpiryDate());
                });

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setPlanName(request.getPlanName());
        membership.setStartDate(LocalDate.now());
        membership.setStatus("ACTIVE");

        // Plan नुसार amount आणि expiry set करा
        switch (request.getPlanName().toUpperCase()) {
            case "MONTHLY":
                membership.setAmount(999.0);
                membership.setExpiryDate(LocalDate.now().plusMonths(1));
                break;
            case "QUARTERLY":
                membership.setAmount(2499.0);
                membership.setExpiryDate(LocalDate.now().plusMonths(3));
                break;
            case "YEARLY":
                membership.setAmount(7999.0);
                membership.setExpiryDate(LocalDate.now().plusYears(1));
                break;
            default:
                throw new RuntimeException("Invalid plan: " + request.getPlanName() + " — use MONTHLY / QUARTERLY / YEARLY");
        }

        return membershipRepository.save(membership);
    }

    // User ची active membership पाहा
    public Membership getActiveMembership(Long userId) {
        return membershipRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseThrow(() -> new RuntimeException("No active membership found for user: " + userId));
    }

    // User च्या सगळ्या memberships पाहा
    public List<Membership> getUserMemberships(Long userId) {
        return membershipRepository.findByUserId(userId);
    }

    // Admin — सगळ्या active memberships पाहा
    public List<Membership> getAllActiveMemberships() {
        return membershipRepository.findByStatus("ACTIVE");
    }

    // Membership cancel करा
    public Membership cancelMembership(Long membershipId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found: " + membershipId));
        membership.setStatus("CANCELLED");
        return membershipRepository.save(membership);
    }

    // Membership expire check करा — expiry date गेली का
    public Membership checkAndExpireMembership(Long membershipId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new RuntimeException("Membership not found: " + membershipId));

        if (LocalDate.now().isAfter(membership.getExpiryDate())) {
            membership.setStatus("EXPIRED");
            membershipRepository.save(membership);
        }
        return membership;
    }
}
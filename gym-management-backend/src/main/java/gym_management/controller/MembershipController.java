package gym_management.controller;

import gym_management.dto.MembershipRequest;
import gym_management.entity.Membership;
import gym_management.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    // POST /api/membership/buy → membership buy करा
    @PostMapping("/buy")
    public ResponseEntity<Membership> buyMembership(@RequestBody MembershipRequest request) {
        return ResponseEntity.ok(membershipService.buyMembership(request));
    }

    // GET /api/membership/active/{userId} → active membership पाहा
    @GetMapping("/active/{userId}")
    public ResponseEntity<Membership> getActiveMembership(@PathVariable Long userId) {
        return ResponseEntity.ok(membershipService.getActiveMembership(userId));
    }

    // GET /api/membership/user/{userId} → सगळ्या memberships पाहा
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Membership>> getUserMemberships(@PathVariable Long userId) {
        return ResponseEntity.ok(membershipService.getUserMemberships(userId));
    }

    // GET /api/membership/all/active → Admin — सगळे active members
    @GetMapping("/all/active")
    public ResponseEntity<List<Membership>> getAllActiveMemberships() {
        return ResponseEntity.ok(membershipService.getAllActiveMemberships());
    }

    // PUT /api/membership/cancel/{membershipId} → membership cancel करा
    @PutMapping("/cancel/{membershipId}")
    public ResponseEntity<Membership> cancelMembership(@PathVariable Long membershipId) {
        return ResponseEntity.ok(membershipService.cancelMembership(membershipId));
    }

    // GET /api/membership/check/{membershipId} → expire झाली का check करा
    @GetMapping("/check/{membershipId}")
    public ResponseEntity<Membership> checkExpiry(@PathVariable Long membershipId) {
        return ResponseEntity.ok(membershipService.checkAndExpireMembership(membershipId));
    }
}
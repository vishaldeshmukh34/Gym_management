package gym_management.controller;

import gym_management.dto.UserProfileRequest;
import gym_management.entity.UserProfile;
import gym_management.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    // POST /api/profile/save  → profile save / update
    @PostMapping("/save")
    public ResponseEntity<UserProfile> saveProfile(@RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(userProfileService.saveProfile(request));
    }

    // GET /api/profile/{userId}  → profile get
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userProfileService.getProfile(userId));
    }
}
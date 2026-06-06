package gym_management.service;

import gym_management.dto.UserProfileRequest;
import gym_management.entity.User;
import gym_management.entity.UserProfile;
import gym_management.repository.UserProfileRepository;
import gym_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    // Save or Update Profile
    public UserProfile saveProfile(UserProfileRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        // If profile already exists → update, else create new
        UserProfile profile = userProfileRepository
                .findByUserId(request.getUserId())
                .orElse(new UserProfile());

        profile.setUser(user);
        profile.setFullName(request.getFullName());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setHeight(request.getHeight());
        profile.setWeight(request.getWeight());
        profile.setFitnessLevel(request.getFitnessLevel());
        profile.setFitnessGoal(request.getFitnessGoal());

        return userProfileRepository.save(profile);
    }

    // Get Profile by userId
    public UserProfile getProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user id: " + userId));
    }
}
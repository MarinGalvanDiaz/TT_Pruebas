package com.liberate.auth.service;

import com.liberate.auth.dto.response.UserResponse;
import com.liberate.auth.entity.User;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.exception.ResourceNotFoundException;
import com.liberate.auth.repository.UserRepository;
import com.liberate.auth.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return UserResponse.fromEntity(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(UserPrincipal principal, UserRole newRole) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setRole(newRole);
        User updated = userRepository.save(user);
        return UserResponse.fromEntity(updated);
    }
}

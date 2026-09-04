package com.liberate.auth.controller;

import com.liberate.auth.dto.response.UserResponse;
import com.liberate.auth.entity.UserRole;
import com.liberate.auth.security.UserPrincipal;
import com.liberate.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = userService.getCurrentUserProfile(userPrincipal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/role")
    public ResponseEntity<UserResponse> updateRole(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                  @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        UserRole newRole = UserRole.valueOf(roleStr);
        UserResponse response = userService.updateUserRole(userPrincipal, newRole);
        return ResponseEntity.ok(response);
    }
}

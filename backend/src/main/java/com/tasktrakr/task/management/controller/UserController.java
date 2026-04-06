package com.tasktrakr.task.management.controller;

import com.tasktrakr.task.management.dto.request.UserRequestDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMyDetails(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserById(user.getUserId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateMyDetails(@AuthenticationPrincipal User user,
                                                           @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        return ResponseEntity.ok(userService.updateUser(user.getUserId(), userUpdateDTO));
    }

}
package com.tasktrakr.task.management.controller;

import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.service.AdminService;
import com.tasktrakr.task.management.enums.Role;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/tasks")
    public ResponseEntity<List<AdminTaskResponseDTO>> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<AdminTaskResponseDTO> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(adminService.getTaskById(taskId));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserById(userId));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long userId,
                                                      @Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(adminService.updateUser(userId, dto));
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<UserResponseDTO> updateUserRole(@PathVariable Long userId,
                                                          @RequestParam Role role) {
        return ResponseEntity.ok(adminService.updateUserRole(userId, role));
    }

    @PatchMapping("/users/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        adminService.deactivateUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{userId}/reactivate")
    public ResponseEntity<Void> reactivateUser(@PathVariable Long userId) {
        adminService.reactivateUser(userId);
        return ResponseEntity.noContent().build();
    }
}
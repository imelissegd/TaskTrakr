package com.tasktrakr.task.management.controller;

import com.tasktrakr.task.management.dto.request.TaskSearchDTO;
import com.tasktrakr.task.management.dto.request.UserSearchDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.FilterResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.enums.TaskStatus;
import com.tasktrakr.task.management.service.AdminService;
import com.tasktrakr.task.management.enums.Role;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

//    @GetMapping("/tasks")
//    public ResponseEntity<List<AdminTaskResponseDTO>> getAllTasks() {
//        return ResponseEntity.ok(adminService.getAllTasks());
//    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<AdminTaskResponseDTO> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(adminService.getTaskById(taskId));
    }

//    @GetMapping("/users")
//    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
//        return ResponseEntity.ok(adminService.getAllUsers());
//    }

    @GetMapping("/users")
    public ResponseEntity<FilterResponseDTO<UserResponseDTO>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        UserSearchDTO searchDTO = new UserSearchDTO();
        searchDTO.setName(name);
        searchDTO.setEmail(email);
        searchDTO.setRole(role);
        searchDTO.setActive(active);
        searchDTO.setPage(page);
        searchDTO.setSize(size);
        searchDTO.setSortBy(sortBy);
        searchDTO.setSortDir(sortDir);

        return ResponseEntity.ok(adminService.searchUsers(searchDTO));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserById(userId));
    }

    @GetMapping("/tasks")
    public ResponseEntity<FilterResponseDTO<AdminTaskResponseDTO>> getAllTasks(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) LocalDateTime deadlineFrom,
            @RequestParam(required = false) LocalDateTime deadlineTo,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        TaskSearchDTO searchDTO = new TaskSearchDTO();
        searchDTO.setTitle(title);
        searchDTO.setDeadlineFrom(deadlineFrom);
        searchDTO.setDeadlineTo(deadlineTo);
        searchDTO.setStatus(status);
        searchDTO.setPage(page);
        searchDTO.setSize(size);
        searchDTO.setSortBy(sortBy);
        searchDTO.setSortDir(sortDir);

        return ResponseEntity.ok(adminService.searchAllTasks(searchDTO, userId));
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
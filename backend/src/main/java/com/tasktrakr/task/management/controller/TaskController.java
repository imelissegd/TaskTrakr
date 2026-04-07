package com.tasktrakr.task.management.controller;

import com.tasktrakr.task.management.dto.request.TaskRequestDTO;
import com.tasktrakr.task.management.dto.request.TaskUpdateDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getMyTasks() {
        return ResponseEntity.ok(taskService.getTasksByUserId(getAuthenticatedUserId()));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId, getAuthenticatedUserId()));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO taskRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(taskRequestDTO, getAuthenticatedUserId()));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long taskId,
                                                      @Valid @RequestBody TaskUpdateDTO taskUpdateDTO) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskUpdateDTO, getAuthenticatedUserId()));
    }

    @PatchMapping("/{taskId}/cancel")
    public ResponseEntity<TaskResponseDTO> cancelTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.cancelTask(taskId, getAuthenticatedUserId()));
    }

    @PatchMapping("/{taskId}/reactivate")
    public ResponseEntity<TaskResponseDTO> reactivateTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.reactivateTask(taskId, getAuthenticatedUserId()));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId, getAuthenticatedUserId());
        return ResponseEntity.noContent().build();
    }

    private Long getAuthenticatedUserId() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return user.getUserId();
    }
}
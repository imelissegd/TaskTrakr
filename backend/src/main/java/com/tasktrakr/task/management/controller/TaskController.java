package com.tasktrakr.task.management.controller;

import com.tasktrakr.task.management.dto.request.TaskRequestDTO;
import com.tasktrakr.task.management.dto.request.TaskSearchDTO;
import com.tasktrakr.task.management.dto.request.TaskUpdateDTO;
import com.tasktrakr.task.management.dto.response.FilterResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.enums.TaskStatus;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId, getAuthenticatedUserId()));
    }

    @GetMapping
    public ResponseEntity<FilterResponseDTO<TaskResponseDTO>> getMyTasks(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) LocalDate deadlineFrom,
            @RequestParam(required = false) LocalDate deadlineTo,
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

        return ResponseEntity.ok(taskService.searchTasks(searchDTO, user.getUserId()));
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

    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponseDTO> completeTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.completeTask(taskId, getAuthenticatedUserId()));
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
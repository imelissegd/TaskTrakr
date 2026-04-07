package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.TaskRequestDTO;
import com.tasktrakr.task.management.dto.request.TaskUpdateDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.enums.TaskStatus;
import com.tasktrakr.task.management.exception.InvalidTaskStateException;
import com.tasktrakr.task.management.exception.TaskNotFoundException;
import com.tasktrakr.task.management.exception.UnauthorizedTaskAccessException;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.Task;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.TaskRepository;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.implementation.TaskServiceImplementation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskServiceImplementation taskService;

    private User user;
    private Task task;

    @BeforeEach
    void setup() {
        user = new User();
        user.setUserId(1L);
        user.setUsername("john");

        task = new Task();
        task.setTaskId(1L);
        task.setTitle("Test Task");
        task.setDescription("Description");
        task.setStatus(TaskStatus.Pending);
        task.setUser(user);
    }

    @Test
    void testGetAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(task));

        List<TaskResponseDTO> tasks = taskService.getAllTasks();

        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getTitle());
    }

    @Test
    void testGetTasksByUserId() {
        when(taskRepository.findByUser_UserId(1L)).thenReturn(List.of(task));

        List<TaskResponseDTO> tasks = taskService.getTasksByUserId(1L);

        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getTitle());
    }

    @Test
    void testGetTaskById_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskResponseDTO result = taskService.getTaskById(1L, 1L);

        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void testGetTaskById_unauthorized() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(UnauthorizedTaskAccessException.class, () -> taskService.getTaskById(1L, 2L));
    }

    @Test
    void testGetTaskById_notFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getTaskById(1L, 1L));
    }

    @Test
    void testCreateTask_success() {
        TaskRequestDTO dto = new TaskRequestDTO();
        dto.setTitle("New Task");
        dto.setDescription("Desc");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO response = taskService.createTask(dto, 1L);

        assertEquals(task.getTitle(), response.getTitle());
    }

    @Test
    void testCreateTask_userNotFound() {
        TaskRequestDTO dto = new TaskRequestDTO();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> taskService.createTask(dto, 1L));
    }

    @Test
    void testCompleteTask_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO response = taskService.completeTask(1L, 1L);

        assertEquals(TaskStatus.Completed, response.getStatus());
    }

    @Test
    void testCompleteTask_alreadyCompleted() {
        task.setStatus(TaskStatus.Completed);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(InvalidTaskStateException.class, () -> taskService.completeTask(1L, 1L));
    }

    @Test
    void testCompleteTask_cancelled() {
        task.setStatus(TaskStatus.Cancelled);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(InvalidTaskStateException.class, () -> taskService.completeTask(1L, 1L));
    }

    @Test
    void testCancelTask_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO response = taskService.cancelTask(1L, 1L);

        assertEquals(TaskStatus.Cancelled, response.getStatus());
    }

    @Test
    void testReactivateTask_success() {
        task.setStatus(TaskStatus.Cancelled);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDTO response = taskService.reactivateTask(1L, 1L);

        assertEquals(TaskStatus.Pending, response.getStatus());
    }

    @Test
    void testReactivateTask_notCancelled() {
        task.setStatus(TaskStatus.Pending);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(InvalidTaskStateException.class, () -> taskService.reactivateTask(1L, 1L));
    }

    @Test
    void testDeleteTask_success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        doNothing().when(taskRepository).delete(task);

        assertDoesNotThrow(() -> taskService.deleteTask(1L, 1L));
        verify(taskRepository).delete(task);
    }

    @Test
    void testDeleteTask_unauthorized() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(UnauthorizedTaskAccessException.class, () -> taskService.deleteTask(1L, 2L));
    }
}
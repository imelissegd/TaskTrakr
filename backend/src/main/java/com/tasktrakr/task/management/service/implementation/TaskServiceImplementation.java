package com.tasktrakr.task.management.service.implementation;

import com.tasktrakr.task.management.dto.request.TaskRequestDTO;
import com.tasktrakr.task.management.dto.request.TaskSearchDTO;
import com.tasktrakr.task.management.dto.request.TaskUpdateDTO;
import com.tasktrakr.task.management.dto.response.FilterResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.enums.TaskStatus;
import com.tasktrakr.task.management.exception.*;
import com.tasktrakr.task.management.model.Task;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.TaskRepository;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImplementation implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDTO getTaskById(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        if (!task.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedTaskAccessException(taskId);
        }
        return mapToResponseDTO(task);
    }

    @Override
    public FilterResponseDTO<TaskResponseDTO> searchTasks(TaskSearchDTO searchDTO, Long userId) {
        Sort sort = searchDTO.getSortDir().equalsIgnoreCase("asc")
                ? Sort.by(searchDTO.getSortBy()).ascending()
                : Sort.by(searchDTO.getSortBy()).descending();

        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), sort);

        Page<Task> taskPage = taskRepository.searchTasksforUser(
                userId,
                searchDTO.getTitle(),
                searchDTO.getStatus(),
                searchDTO.getDeadlineFrom(),
                searchDTO.getDeadlineTo(),
                pageable
        );

        List<TaskResponseDTO> content = taskPage.getContent()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());

        return new FilterResponseDTO<>(
                content,
                taskPage.getNumber(),
                taskPage.getSize(),
                taskPage.getTotalElements(),
                taskPage.getTotalPages(),
                taskPage.isLast()
        );
    }

    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (taskRequestDTO.getDeadline() != null && taskRequestDTO.getDeadline().isBefore(LocalDateTime.now())) {
            throw new InvalidDeadlineException();
        }

        Task task = new Task();
        task.setUser(user);
        task.setTitle(taskRequestDTO.getTitle());
        task.setDescription(taskRequestDTO.getDescription());
        task.setDeadline(taskRequestDTO.getDeadline());
        task.setStatus(taskRequestDTO.getStatus() != null ? taskRequestDTO.getStatus() : TaskStatus.Pending);
        Task savedTask = taskRepository.save(task);
        return mapToResponseDTO(savedTask);
    }

    @Override
    public TaskResponseDTO updateTask(Long taskId, TaskUpdateDTO taskUpdateDTO, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        if (!task.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedTaskAccessException(taskId);
        }

        if (taskUpdateDTO.getTitle() != null && !taskUpdateDTO.getTitle().isBlank()) {
            task.setTitle(taskUpdateDTO.getTitle());
        }
        if (taskUpdateDTO.getDescription() != null) {
            task.setDescription(taskUpdateDTO.getDescription());
        }
        if (taskUpdateDTO.getDeadline() != null) {
            if (taskUpdateDTO.getDeadline().isBefore(LocalDateTime.now())) {
                throw new InvalidDeadlineException();
            }
            task.setDeadline(taskUpdateDTO.getDeadline());
        }
        if (taskUpdateDTO.getStatus() != null) {
            task.setStatus(taskUpdateDTO.getStatus());
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponseDTO(updatedTask);
    }

    @Override
    public TaskResponseDTO completeTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        if (!task.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedTaskAccessException(taskId);
        }
        if (task.getStatus() == TaskStatus.Completed) {
            throw InvalidTaskStateException.alreadyCompleted();
        }
        if (task.getStatus() == TaskStatus.Cancelled) {
            throw InvalidTaskStateException.cannotCompleteCancelled();
        }
        task.setStatus(TaskStatus.Completed);
        return mapToResponseDTO(taskRepository.save(task));
    }

    @Override
    public TaskResponseDTO cancelTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        if (!task.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedTaskAccessException(taskId);
        }
        task.setStatus(TaskStatus.Cancelled);
        return mapToResponseDTO(taskRepository.save(task));
    }

    @Override
    public TaskResponseDTO reactivateTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        if (!task.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedTaskAccessException(taskId);
        }
        if (task.getStatus() != TaskStatus.Cancelled) {
            throw InvalidTaskStateException.notCancelled();
        }
        task.setStatus(TaskStatus.Pending);
        return mapToResponseDTO(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        if (!task.getUser().getUserId().equals(userId)) {
            throw new UnauthorizedTaskAccessException(taskId);
        }
        taskRepository.delete(task);
    }

    private TaskResponseDTO mapToResponseDTO(Task task) {
        TaskResponseDTO response = new TaskResponseDTO();
        response.setTaskId(task.getTaskId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDeadline(task.getDeadline());
        response.setStatus(task.getStatus());
        return response;
    }
}
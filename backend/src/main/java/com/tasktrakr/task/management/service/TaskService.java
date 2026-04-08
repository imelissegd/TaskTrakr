package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.TaskRequestDTO;
import com.tasktrakr.task.management.dto.request.TaskSearchDTO;
import com.tasktrakr.task.management.dto.request.TaskUpdateDTO;
import com.tasktrakr.task.management.dto.response.FilterResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;

import java.util.List;

public interface TaskService {

    List<TaskResponseDTO> getAllTasks();

    TaskResponseDTO getTaskById(Long taskId, Long userId);

    FilterResponseDTO<TaskResponseDTO> searchTasks(TaskSearchDTO searchDTO, Long userId);

    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId);

    TaskResponseDTO updateTask(Long taskId, TaskUpdateDTO taskUpdateDTO, Long userId);

    TaskResponseDTO completeTask(Long taskId, Long userId);

    TaskResponseDTO cancelTask(Long taskId, Long userId);

    TaskResponseDTO reactivateTask(Long taskId, Long userId);

    void deleteTask(Long taskId, Long userId);
}
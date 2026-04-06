package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.TaskRequestDTO;
import com.tasktrakr.task.management.dto.request.TaskUpdateDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;

import java.util.List;

public interface TaskService {

    List<TaskResponseDTO> getAllTasks();

    List<TaskResponseDTO> getTasksByUserId(Long userId);

    TaskResponseDTO getTaskById(Long taskId, Long userId);

    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO, Long userId);

    TaskResponseDTO updateTask(Long taskId, TaskUpdateDTO taskUpdateDTO, Long userId);

    void deleteTask(Long taskId, Long userId);
}
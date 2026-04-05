package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;

import java.util.List;

public interface AdminService {

    List<UserResponseDTO> getAllUsers();

    List<AdminTaskResponseDTO> getAllTasks();

    UserResponseDTO getUserById(Long userId);

    void deactivateUser(Long userId);
}
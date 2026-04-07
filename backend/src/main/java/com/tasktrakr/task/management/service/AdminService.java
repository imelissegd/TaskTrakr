package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.enums.Role;

import java.util.List;

public interface AdminService {

    List<AdminTaskResponseDTO> getAllTasks();

    AdminTaskResponseDTO getTaskById(Long taskId);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long userId);

    UserResponseDTO updateUser(Long userId, UserUpdateDTO userUpdateDTO);

    UserResponseDTO updateUserRole(Long userId, Role role);

    void deactivateUser(Long userId);

    void reactivateUser(Long userId);
}
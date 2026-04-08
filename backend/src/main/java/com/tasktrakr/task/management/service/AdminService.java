package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.TaskSearchDTO;
import com.tasktrakr.task.management.dto.request.UserSearchDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.FilterResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.enums.Role;

import java.util.List;

public interface AdminService {

    AdminTaskResponseDTO getTaskById(Long taskId);

    UserResponseDTO getUserById(Long userId);

    FilterResponseDTO<UserResponseDTO> searchUsers(UserSearchDTO searchDTO);

    FilterResponseDTO<AdminTaskResponseDTO> searchAllTasks(TaskSearchDTO searchDTO, Long userId);

    UserResponseDTO updateUser(Long userId, UserUpdateDTO userUpdateDTO);

    UserResponseDTO updateUserRole(Long userId, Role role);

    void deactivateUser(Long userId);

    void reactivateUser(Long userId);
}
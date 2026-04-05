package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.UserRequestDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO registerUser(UserRequestDTO userRequestDTO);

    UserResponseDTO getUserById(Long userId);

    UserResponseDTO updateUser(Long userId, UserUpdateDTO userRequestDTO);

    void deactivateUser(Long userId);
}
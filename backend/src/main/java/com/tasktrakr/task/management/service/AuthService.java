package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.LoginRequestDTO;
import com.tasktrakr.task.management.dto.response.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
}
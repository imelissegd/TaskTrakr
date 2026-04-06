package com.tasktrakr.task.management.service.implementation;

import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.AdminTaskResponseDTO;
import com.tasktrakr.task.management.dto.response.TaskResponseDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.exception.InvalidUserStateException;
import com.tasktrakr.task.management.exception.LastAdminException;
import com.tasktrakr.task.management.exception.TaskNotFoundException;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.Task;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.TaskRepository;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.AdminService;
import com.tasktrakr.task.management.enums.Role;
import com.tasktrakr.task.management.enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImplementation implements AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @Override
    public List<AdminTaskResponseDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapTaskToAdminResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminTaskResponseDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        return mapTaskToAdminResponseDTO(task);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapUserToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return mapUserToResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Long userId, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (userUpdateDTO.getFirstname() != null && !userUpdateDTO.getFirstname().isBlank())
            user.setFirstname(userUpdateDTO.getFirstname());
        if (userUpdateDTO.getMiddlename() != null && !userUpdateDTO.getMiddlename().isBlank())
            user.setMiddlename(userUpdateDTO.getMiddlename());
        if (userUpdateDTO.getLastname() != null && !userUpdateDTO.getLastname().isBlank())
            user.setLastname(userUpdateDTO.getLastname());
        if (userUpdateDTO.getEmail() != null && !userUpdateDTO.getEmail().isBlank())
            user.setEmail(userUpdateDTO.getEmail());
        return mapUserToResponseDTO(userRepository.save(user));
    }

    @Override
    public UserResponseDTO updateUserRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getRole() == role) {
            throw InvalidUserStateException.alreadyHasRole(role);
        }
        if (user.getRole() == Role.Admin && role == Role.User) {
            long activeAdminCount = userRepository.countByRoleAndActive(Role.Admin, true);
            if (activeAdminCount <= 1) {
                throw new LastAdminException();
            }
        }
        user.setRole(role);
        return mapUserToResponseDTO(userRepository.save(user));
    }

    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (!user.getActive()) {
            throw InvalidUserStateException.alreadyDeactivated();
        }
        if (user.getRole() == Role.Admin) {
            long activeAdminCount = userRepository.countByRoleAndActive(Role.Admin, true);
            if (activeAdminCount <= 1) {
                throw new LastAdminException();
            }
        }
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void reactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getActive()) {
            throw InvalidUserStateException.alreadyActive();
        }
        user.setActive(true);
        userRepository.save(user);
    }

    private UserResponseDTO mapUserToResponseDTO(User user) {
        UserResponseDTO response = new UserResponseDTO();
        response.setUserId(user.getUserId());
        response.setFirstname(user.getFirstname());
        response.setMiddlename(user.getMiddlename());
        response.setLastname(user.getLastname());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        response.setActive(user.getActive());
        response.setEmail(user.getEmail());
        return response;
    }

    private AdminTaskResponseDTO mapTaskToAdminResponseDTO(Task task) {
        AdminTaskResponseDTO response = new AdminTaskResponseDTO();
        response.setTaskId(task.getTaskId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setUsername(task.getUser().getUsername());
        return response;
    }
}
package com.tasktrakr.task.management.service.implementation;

import com.tasktrakr.task.management.dto.request.UserRequestDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setFirstname(userRequestDTO.getFirstname());
        user.setMiddlename(userRequestDTO.getMiddlename());
        user.setLastname(userRequestDTO.getLastname());
        user.setUsername(userRequestDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        user.setActive(true);
        User savedUser = userRepository.save(user);
        return mapToResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return mapToResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Long userId, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (userUpdateDTO.getFirstname() != null && !userUpdateDTO.getFirstname().isEmpty()) {
            user.setFirstname(userUpdateDTO.getFirstname());
        }
        if (userUpdateDTO.getMiddlename() != null) {
            user.setMiddlename(userUpdateDTO.getMiddlename());
        }
        if (userUpdateDTO.getLastname() != null && !userUpdateDTO.getLastname().isEmpty()) {
            user.setLastname(userUpdateDTO.getLastname());
        }
        if (userUpdateDTO.getUsername() != null && !userUpdateDTO.getUsername().isEmpty()) {
            user.setUsername(userUpdateDTO.getUsername());
        }
        if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
        }
        User updatedUser = userRepository.save(user);
        return mapToResponseDTO(updatedUser);
    }

    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        user.setActive(false);
        userRepository.save(user);
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        UserResponseDTO response = new UserResponseDTO();
        response.setUserId(user.getUserId());
        response.setFirstname(user.getFirstname());
        response.setMiddlename(user.getMiddlename());
        response.setLastname(user.getLastname());
        response.setUsername(user.getUsername());
        response.setActive(user.getActive());
        response.setRole(user.getRole());
        return response;
    }
}
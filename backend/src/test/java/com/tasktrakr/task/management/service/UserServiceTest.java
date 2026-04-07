package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.dto.request.UserRequestDTO;
import com.tasktrakr.task.management.dto.request.UserUpdateDTO;
import com.tasktrakr.task.management.dto.response.UserResponseDTO;
import com.tasktrakr.task.management.exception.DuplicateUsernameException;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.implementation.UserServiceImplementation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImplementation userService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setUserId(1L);
        user.setUsername("john");
        user.setFirstname("John");
        user.setLastname("Doe");
        user.setPassword("encodedPass");
    }

    @Test
    void testRegisterUser_success() {
        UserRequestDTO dto = new UserRequestDTO();
        dto.setUsername("john");
        dto.setFirstname("John");
        dto.setLastname("Doe");
        dto.setPassword("pass123");

        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDTO response = userService.registerUser(dto);

        assertEquals("John", response.getFirstname());
        assertEquals("john", response.getUsername());
        assertEquals("Doe", response.getLastname());
    }

    @Test
    void testRegisterUser_duplicateUsername() {
        UserRequestDTO dto = new UserRequestDTO();
        dto.setUsername("john");

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));

        assertThrows(DuplicateUsernameException.class, () -> userService.registerUser(dto));
    }

    @Test
    void testGetUserById_success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponseDTO response = userService.getUserById(1L);

        assertEquals("John", response.getFirstname());
    }

    @Test
    void testGetUserById_notFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    void testUpdateUser_success() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setFirstname("Johnny");
        dto.setPassword("newPass");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNewPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDTO response = userService.updateUser(1L, dto);

        assertEquals("Johnny", response.getFirstname());
        verify(passwordEncoder).encode("newPass");
    }

    @Test
    void testUpdateUser_notFound() {
        UserUpdateDTO dto = new UserUpdateDTO();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.updateUser(1L, dto));
    }
}
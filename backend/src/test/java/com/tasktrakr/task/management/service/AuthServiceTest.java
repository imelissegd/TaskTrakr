package com.tasktrakr.task.management.service;

import com.tasktrakr.task.management.config.JwtUtil;
import com.tasktrakr.task.management.dto.request.LoginRequestDTO;
import com.tasktrakr.task.management.dto.response.LoginResponseDTO;
import com.tasktrakr.task.management.exception.AccountDeactivatedException;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.implementation.AuthServiceImplementation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImplementation authService;

    private LoginRequestDTO loginRequest;
    private User activeUser;
    private User inactiveUser;

    @BeforeEach
    void setup() {
        loginRequest = new LoginRequestDTO();
        loginRequest.setUsername("john");
        loginRequest.setPassword("password123");

        activeUser = new User();
        activeUser.setUsername("john");
        activeUser.setActive(true);
        activeUser.setRole(com.tasktrakr.task.management.enums.Role.User);

        inactiveUser = new User();
        inactiveUser.setUsername("john");
        inactiveUser.setActive(false);
        inactiveUser.setRole(com.tasktrakr.task.management.enums.Role.User);
    }

    @Test
    void testLogin_success() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(activeUser));
        when(jwtUtil.generateToken("john", "User")).thenReturn("jwt-token");

        LoginResponseDTO response = authService.login(loginRequest);

        assertEquals("jwt-token", response.getToken());
        assertEquals("john", response.getUsername());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testLogin_userNotFound() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> authService.login(loginRequest));
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testLogin_accountDeactivated() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(inactiveUser));

        assertThrows(AccountDeactivatedException.class, () -> authService.login(loginRequest));
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testLogin_authenticationFails() {
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}
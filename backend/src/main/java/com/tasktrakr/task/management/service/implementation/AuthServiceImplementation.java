package com.tasktrakr.task.management.service.implementation;

import com.tasktrakr.task.management.config.JwtUtil;
import com.tasktrakr.task.management.dto.request.LoginRequestDTO;
import com.tasktrakr.task.management.dto.response.LoginResponseDTO;
import com.tasktrakr.task.management.exception.AccountDeactivatedException;
import com.tasktrakr.task.management.exception.UserNotFoundException;
import com.tasktrakr.task.management.model.User;
import com.tasktrakr.task.management.repository.UserRepository;
import com.tasktrakr.task.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImplementation implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUsername(),
                        loginRequestDTO.getPassword()
                )
        );
        User user = userRepository.findByUsername(loginRequestDTO.getUsername())
                .orElseThrow(() -> new UserNotFoundException(loginRequestDTO.getUsername()));
        if (!user.getActive()) {
            throw new AccountDeactivatedException();
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new LoginResponseDTO(token, user.getUsername());
    }
}
package com.tasktrakr.task.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {

    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstname;

    @Size(max = 50, message = "Middle name cannot exceed 50 characters")
    private String middlename;

    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastname;

    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Size(max = 50, message = "Email cannot exceed 50 characters")
    private String email;
}
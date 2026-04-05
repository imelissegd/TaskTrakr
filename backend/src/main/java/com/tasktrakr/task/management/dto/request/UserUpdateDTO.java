package com.tasktrakr.task.management.dto.request;

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

    @Size(max = 50, message = "Username cannot exceed 50 characters")
    private String username;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
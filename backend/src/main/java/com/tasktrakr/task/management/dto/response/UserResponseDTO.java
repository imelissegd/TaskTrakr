package com.tasktrakr.task.management.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long userId;
    private String firstname;
    private String middlename;
    private String lastname;
    private String username;
    private Boolean active;
    private String role;
}
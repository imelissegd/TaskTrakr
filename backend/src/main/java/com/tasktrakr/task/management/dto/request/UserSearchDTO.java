package com.tasktrakr.task.management.dto.request;

import com.tasktrakr.task.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDTO {

    private String name;
    private String email;
    private Role role;
    private Boolean active;
    private int page = 0;
    private int size = 10;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
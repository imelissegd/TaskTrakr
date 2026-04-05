package com.tasktrakr.task.management.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminTaskResponseDTO {

    private Long taskId;
    private String title;
    private String description;
    private String status;
    private String username;
}
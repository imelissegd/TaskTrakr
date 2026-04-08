package com.tasktrakr.task.management.dto.response;

import com.tasktrakr.task.management.enums.TaskStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminTaskResponseDTO {

    private Long taskId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private TaskStatus status;
    private String username;

}
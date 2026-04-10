package com.tasktrakr.task.management.dto.response;

import com.tasktrakr.task.management.enums.TaskStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminTaskResponseDTO {

    private Long taskId;
    private String title;
    private String description;
    private LocalDate deadline;
    private TaskStatus status;
    private String username;

}
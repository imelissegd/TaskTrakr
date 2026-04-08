package com.tasktrakr.task.management.dto.request;

import com.tasktrakr.task.management.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskSearchDTO {

    private String title;
    private LocalDateTime deadlineFrom;
    private LocalDateTime deadlineTo;
    private TaskStatus status;
    private int page = 0;
    private int size = 10;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
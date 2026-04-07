package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(Long taskId) {
        super(MessageUtil.get("exception.task.not.found", taskId));
    }
}
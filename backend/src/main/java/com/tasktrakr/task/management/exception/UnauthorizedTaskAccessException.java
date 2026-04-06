package com.tasktrakr.task.management.exception;

public class UnauthorizedTaskAccessException extends RuntimeException {
    public UnauthorizedTaskAccessException(Long taskId) {
        super("You do not have permission to access task with ID: " + taskId);
    }
}

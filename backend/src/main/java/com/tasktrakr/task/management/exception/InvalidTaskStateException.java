package com.tasktrakr.task.management.exception;

public class InvalidTaskStateException extends RuntimeException {
    public InvalidTaskStateException() {
        super("Only cancelled tasks can be reactivated");
    }
}

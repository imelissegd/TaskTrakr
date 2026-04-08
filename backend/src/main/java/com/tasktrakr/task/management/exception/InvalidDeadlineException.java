package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class InvalidDeadlineException extends RuntimeException {
    public InvalidDeadlineException() {
        super(MessageUtil.get("exception.task.invalid.deadline"));
    }
}

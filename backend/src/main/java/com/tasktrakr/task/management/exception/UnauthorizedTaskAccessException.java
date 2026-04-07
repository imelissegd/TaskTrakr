package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class UnauthorizedTaskAccessException extends RuntimeException {
    public UnauthorizedTaskAccessException(Long taskId) {
        super(MessageUtil.get("exception.task.unauthorized.access", taskId));
    }
}
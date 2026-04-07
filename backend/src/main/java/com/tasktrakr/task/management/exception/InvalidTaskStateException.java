package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class InvalidTaskStateException extends RuntimeException {
    private InvalidTaskStateException(String message) {
        super(message);
    }

    public static InvalidTaskStateException notCancelled() {
        return new InvalidTaskStateException(MessageUtil.get("exception.task.not.cancelled"));
    }

    public static InvalidTaskStateException alreadyCompleted() {
        return new InvalidTaskStateException(MessageUtil.get("exception.task.already.completed"));
    }

    public static InvalidTaskStateException cannotCompleteCancelled() {
        return new InvalidTaskStateException(MessageUtil.get("exception.task.cannot.complete.cancelled"));
    }
}
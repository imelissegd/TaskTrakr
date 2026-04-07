package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long userId) {
        super(MessageUtil.get("exception.user.not.found", userId));
    }

    public UserNotFoundException(String username) {
        super(MessageUtil.get("exception.user.not.found.username", username));
    }
}

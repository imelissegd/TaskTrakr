package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class AccountDeactivatedException extends RuntimeException {
    public AccountDeactivatedException() {
        super(MessageUtil.get("exception.user.account.deactivated"));
    }
}

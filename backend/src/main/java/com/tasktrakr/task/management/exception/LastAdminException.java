package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.util.MessageUtil;

public class LastAdminException extends RuntimeException {
    public LastAdminException() {
        super(MessageUtil.get("exception.admin.last.admin"));
    }
}
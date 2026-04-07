package com.tasktrakr.task.management.exception;

public class LastAdminException extends RuntimeException {
    public LastAdminException() {
        super("Cannot deactivate the last active admin account. Promote another user to Admin first.");
    }
}
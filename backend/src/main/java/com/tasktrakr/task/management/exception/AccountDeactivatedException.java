package com.tasktrakr.task.management.exception;

public class AccountDeactivatedException extends RuntimeException {
    public AccountDeactivatedException() {
        super("This account has been deactivated");
    }
}

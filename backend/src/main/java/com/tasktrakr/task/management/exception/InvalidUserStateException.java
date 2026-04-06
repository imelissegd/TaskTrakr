package com.tasktrakr.task.management.exception;

public class InvalidUserStateException extends RuntimeException {
  public InvalidUserStateException(boolean isActive) {
    super(isActive ? "User is already active." : "User is already deactivated.");
  }
}

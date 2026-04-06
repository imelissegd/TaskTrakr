package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.enums.Role;

public class InvalidUserStateException extends RuntimeException {
  private InvalidUserStateException(String message) {
    super(message);
  }

  public static InvalidUserStateException alreadyActive() {
    return new InvalidUserStateException("User is already active.");
  }

  public static InvalidUserStateException alreadyDeactivated() {
    return new InvalidUserStateException("User is already deactivated.");
  }

  public static InvalidUserStateException alreadyHasRole(Role role) {
    return new InvalidUserStateException("User already has the role: " + role.name());
  }
}
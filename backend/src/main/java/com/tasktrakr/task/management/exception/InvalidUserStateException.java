package com.tasktrakr.task.management.exception;

import com.tasktrakr.task.management.enums.Role;
import com.tasktrakr.task.management.util.MessageUtil;

public class InvalidUserStateException extends RuntimeException {
  private InvalidUserStateException(String message) {
    super(message);
  }

  public static InvalidUserStateException alreadyActive() {
    return new InvalidUserStateException(MessageUtil.get("exception.user.already.active"));
  }

  public static InvalidUserStateException alreadyDeactivated() {
    return new InvalidUserStateException(MessageUtil.get("exception.user.already.deactivated"));
  }

  public static InvalidUserStateException alreadyHasRole(Role role) {
    return new InvalidUserStateException(MessageUtil.get("exception.user.already.has.role", role.name()));
  }
}
package com.tasktrakr.task.management.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MessageUtil {

    private static MessageSource messageSource;

    @Autowired
    public void setMessageSource(MessageSource messageSource) {
        MessageUtil.messageSource = messageSource;
    }

    public static String get(String key, Object... args) {
        if (messageSource == null) {
            // fallback for unit tests — just return the key with args if provided
            return args.length > 0 ? String.format(key, args) : key;
        }
        String message = messageSource.getMessage(key, null, Locale.getDefault());
        return args.length > 0 ? String.format(message, args) : message;
    }
}
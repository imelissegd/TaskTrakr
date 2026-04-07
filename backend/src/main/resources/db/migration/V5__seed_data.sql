INSERT IGNORE INTO users (firstname, middlename, lastname, username, password, role, email, is_active)
VALUES
       ( 'Admin', NULL, 'User', 'admin', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'Admin', 'admin@email.com', true ),
       ( 'John', 'A', 'Doe', 'johndoe', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'johndoe@email.com', true ),
       ( 'Jane', 'B', 'Doe', 'janedoe', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'janedoe@email.com', true );

INSERT IGNORE INTO tasks (user_id, title, description, status)
VALUES
    (2, 'Task 1', 'Description for task 1', 'Pending'),
    (2, 'Task 2', 'Description for task 2', 'Pending'),
    (2, 'Task 3', 'Description for task 3', 'Completed'),
    (2, 'Task 4', 'Description for task 4', 'Cancelled'),
    (2, 'Task 5', 'Description for task 5', 'Pending');

INSERT IGNORE INTO tasks (user_id, title, description, status)
VALUES
    (3, 'Task 1', 'Description for task 1', 'Pending'),
    (3, 'Task 2', 'Description for task 2', 'Pending'),
    (3, 'Task 3', 'Description for task 3', 'Completed'),
    (3, 'Task 4', 'Description for task 4', 'Cancelled'),
    (3, 'Task 5', 'Description for task 5', 'Pending');

INSERT IGNORE INTO users (firstname, middlename, lastname, username, password, role, email, is_active)
VALUES (
    'Admin',
    NULL,
    'User',
    'admin',
    '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq',
    'Admin',
    'admin@email.com',
    true
);
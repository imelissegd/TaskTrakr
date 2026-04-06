ALTER TABLE users
    ADD COLUMN role ENUM('User', 'Admin') NOT NULL DEFAULT 'User';
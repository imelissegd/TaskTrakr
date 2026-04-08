INSERT IGNORE INTO users (firstname, middlename, lastname, username, password, role, email, is_active)
VALUES
    ( 'Admin', NULL, 'User', 'admin', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'Admin', 'admin@email.com', true ),

    ('John', 'A', 'Doe', 'johndoe', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'johndoe@email.com', true),
    ('Jane', 'B', 'Doe', 'janedoe', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'janedoe@email.com', true),
    ('Will', 'C', 'Smith', 'willsmith', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'willsmith@email.com', true),
    ('Annie', 'D', 'Tibbers', 'annietibbers', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'annietibbers@email.com', true),
    ('Mark', 'E', 'Lee', 'marklee', '$2a$12$XeKBckFXv8/gtO1orb8u9OEnRvpOoNzdqL6Zag3LKkJ/V0TsOpAxq', 'User', 'marklee@email.com', true);

INSERT IGNORE INTO tasks (user_id, title, description, status, deadline) VALUES
(2, 'Fix login bug', 'Investigate and resolve issue where users cannot log in using valid credentials', 'Pending', '2026-04-15'),
(2, 'Implement JWT authentication', 'Add JWT-based authentication to secure API endpoints', 'Completed', '2026-04-10'),
(2, 'Refactor user service', 'Clean up and optimize the user service class for better readability', 'Cancelled', '2026-04-05'),
(2, 'Write unit tests', 'Create unit tests for authentication and user modules', 'Pending', '2026-04-20'),
(2, 'Update API documentation', 'Document all authentication endpoints in Swagger', 'Completed', '2026-04-12');

INSERT IGNORE INTO tasks (user_id, title, description, status, deadline) VALUES
(3, 'Test login module', 'Perform functional testing on login and logout features', 'Completed', '2026-04-08'),
(3, 'Report UI bugs', 'Identify and log UI inconsistencies in the dashboard', 'Pending', '2026-04-18'),
(3, 'Regression testing', 'Run regression tests after latest deployment', 'Pending', '2026-04-17'),
(3, 'Validate password rules', 'Ensure password validation meets security requirements', 'Completed', '2026-04-09'),
(3, 'Test API error handling', 'Verify correct error responses for invalid API requests', 'Cancelled', '2026-04-06');

INSERT IGNORE INTO tasks (user_id, title, description, status, deadline) VALUES
(4, 'Prepare sprint plan', 'Define tasks and goals for the upcoming sprint', 'Completed', '2026-04-07'),
(4, 'Conduct team meeting', 'Hold weekly sync meeting with the development team', 'Pending', '2026-04-08'),
(4, 'Review project timeline', 'Check project deadlines and adjust timelines if needed', 'Pending', '2026-04-12'),
(4, 'Approve feature specs', 'Review and approve feature requirement documents', 'Completed', '2026-04-09'),
(4, 'Client follow-up', 'Reach out to client for feedback on recent delivery', 'Cancelled', '2026-04-13');

INSERT IGNORE INTO tasks (user_id, title, description, status, deadline) VALUES
(5, 'Design login page', 'Create wireframe and final UI design for login page', 'Completed', '2026-04-05'),
(5, 'Improve dashboard layout', 'Redesign dashboard for better user experience', 'Pending', '2026-04-11'),
(5, 'Create design system', 'Establish reusable components and design guidelines', 'Pending', '2026-04-14'),
(5, 'Prototype mobile view', 'Build interactive prototype for mobile screens', 'Completed', '2026-04-10'),
(5, 'Update color palette', 'Revise color scheme based on branding feedback', 'Cancelled', '2026-04-12');

INSERT IGNORE INTO tasks (user_id, title, description, status, deadline) VALUES
(6, 'Handle customer inquiry', 'Respond to customer issue regarding account access', 'Pending', '2026-04-16'),
(6, 'Resolve ticket #1023', 'Fix reported issue related to incorrect task status display', 'Completed', '2026-04-09'),
(6, 'Update FAQ section', 'Add new common issues and solutions to FAQ page', 'Pending', '2026-04-15'),
(6, 'Escalate critical bug', 'Report high priority bug to development team', 'Completed', '2026-04-07'),
(6, 'Follow up unresolved tickets', 'Check and follow up on pending support tickets', 'Cancelled', '2026-04-18');
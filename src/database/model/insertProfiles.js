// Query with the profiles insert
export const INSERT_PROFILES = `
INSERT INTO profiles (name, description)
VALUES
('guest', 'Guest'),
('student', 'Student'),
('teacher', 'Teacher'),
('librarian', 'Librarian'),
('admin', 'Administrator'),
('superadmin', 'Super Administrator'),
('developer', 'Developer');
`
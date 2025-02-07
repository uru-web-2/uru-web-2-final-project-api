// Query with the profiles insert
import {PROFILES} from "../../components/security.js";

export const INSERT_PROFILES = `
INSERT INTO profiles (name, description)
VALUES
('${PROFILES.GUEST.NAME}', 'Guest'),
('${PROFILES.STUDENT.NAME}', 'Student'),
('${PROFILES.TEACHER.NAME}', 'Teacher'),
('${PROFILES.LIBRARIAN.NAME}', 'Librarian'),
('${PROFILES.ADMIN.NAME}', 'Administrator'),
('${PROFILES.SUPERADMIN.NAME}', 'Super Administrator'),
('${PROFILES.DEVELOPER.NAME}', 'Developer');
`
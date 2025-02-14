// Query with the profiles insert
import {PROFILES} from "../../components/security.js";

export const INSERT_PROFILES = `
INSERT INTO profiles (name, description)
VALUES
('${PROFILES.GUEST}', 'Guest'),
('${PROFILES.STUDENT}', 'Student'),
('${PROFILES.TEACHER}', 'Teacher'),
('${PROFILES.LIBRARIAN}', 'Librarian'),
('${PROFILES.ADMIN}', 'Administrator'),
('${PROFILES.SUPER_ADMIN}', 'Super Administrator'),
('${PROFILES.DEVELOPER}', 'Developer');
`
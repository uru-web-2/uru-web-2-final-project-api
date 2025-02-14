import DeepFreeze from "@ralvarezdev/js-deep-freeze";

// Profiles names
export const PROFILES_NAME = DeepFreeze({
    GUEST: 'guest',
    STUDENT: 'student',
    TEACHER: 'teacher',
    LIBRARIAN: 'librarian',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super admin',
    DEVELOPER: 'developer'
});

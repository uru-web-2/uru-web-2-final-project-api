import DeepFreeze from "@ralvarezdev/js-deep-freeze";

// Map with the modules
const MODULES = new Map()

// Map with the objects
const OBJECTS = new Map()

// Map with the methods
const METHODS = new Map()

// Map with the permissions
const PERMISSIONS = new Map()

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
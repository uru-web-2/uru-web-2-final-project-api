import DeepFreeze from "@ralvarezdev/js-deep-freeze";

// Root module manager
export let ROOT_MODULE_MANAGER = null

// Map with the modules
const MODULES = new Map()

// Map with the objects
const OBJECTS = new Map()

// Map with the methods
const METHODS = new Map()

// Map with the permissions
const PERMISSIONS = new Map()

// Profiles
export const PROFILES = DeepFreeze({
    GUEST: {NAME: 'guest'},
    STUDENT: {NAME: 'student'},
    TEACHER: {NAME: 'teacher'},
    LIBRARIAN: {NAME: 'librarian'},
    ADMIN: {NAME: 'admin'},
    SUPERADMIN: {NAME: 'superadmin'},
    DEVELOPER: {NAME: 'developer'}
});